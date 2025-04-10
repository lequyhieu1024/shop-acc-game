import { NextResponse, NextRequest } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Contact } from "@/app/models/entities/Contact";
import { Like } from "typeorm";

export const GET = async (req: NextRequest) => {
    try {
        const contactRepository = await initRepository(Contact);
        const searchParams: URLSearchParams = req.nextUrl.searchParams;

        const size = parseInt(searchParams.get("size") || "10");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: any = {};
        const fullName = searchParams.get("fullName");

        if (fullName !== null) {
            filter.fullName = Like(`%${fullName}%`);
        }

        const contacts = await contactRepository.find({
            where: filter,
            take: size,
        });

        return NextResponse.json({ contacts });
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message || "Lỗi khi lấy danh sách liên hệ.",
        }, { status: 500 });
    }
};

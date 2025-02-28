import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {CardTransaction} from "@/app/models/entities/CardTransaction";

export const GET = async (req: NextRequest) => {
    try {
        const transRepo = await initRepository(CardTransaction);
        const searchParams: URLSearchParams = req.nextUrl.searchParams;

        const size = parseInt(searchParams.get("size") || "20");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * size;

        const status = searchParams.get("status");
        const userCode = searchParams.get("user_code");
        const value = searchParams.get("value");
        const createdAt = searchParams.get("created_at");

        const where: any = {};

        if (status) where.status = status;
        if (userCode) where.user_code = userCode;
        if (value) where.value = Number(value);
        if (createdAt) where.created_at = new Date(createdAt);

        const [transactions, total] = await transRepo.findAndCount({
            where,
            take: size,
            skip,
            order: { created_at: "DESC" },
        });

        return NextResponse.json({
            transactions,
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        });
    } catch (e) {
        return NextResponse.json({ result: false, message: "Lỗi server", error: (e as Error).message }, { status: 500 });
    }
};

import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Category} from "@/app/models/entities/Category";

export const GET = async (req: NextRequest) => {
    try {
        const categoryRepo = await initRepository(Category);
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "15");
        const skip = (page - 1) * limit;

        const [categories, total] = await categoryRepo.findAndCount({
            skip,
            take: limit,
            order: {
                created_at: "DESC",
            }
        });
        return NextResponse.json({
            categories,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json(
            {
                result: false,
                message: (e as Error).message || "Lỗi server nội bộ",
            },
            {status: 500}
        );
    }
}
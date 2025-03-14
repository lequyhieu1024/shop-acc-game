import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Product} from "@/app/models/entities/Product";

export const GET = async (req: NextRequest) => {
    try {
        const productRepo = await initRepository(Product);
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [products, total] = await productRepo.findAndCount({
            skip,
            take: limit,
            order: {
                created_at: "DESC",
            },
            where: {is_for_sale: false}
        });
        return NextResponse.json({
            products,
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
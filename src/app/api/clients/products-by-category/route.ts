import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Product} from "@/app/models/entities/Product";
import {Category} from "@/app/models/entities/Category";

export const GET = async (req: NextRequest) => {
    try {
        const productRepo = await initRepository(Product);
        const categoryRepo = await initRepository(Category);
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "24");
        const categoryId = searchParams.get("categoryId");
        const skip = (page - 1) * limit;

        const categories = await categoryRepo.find();
        
        // Build where clause based on categoryId
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereClause: any = { is_for_sale: true };
        if (categoryId && categoryId !== "all") {
            whereClause.category_id = parseInt(categoryId);
        }

        const [products, total] = await productRepo.findAndCount({
            skip,
            take: limit,
            order: {
                created_at: "DESC",
            },
            where: whereClause
        });

        return NextResponse.json({
            products,
            categories,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
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
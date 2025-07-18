import {initRepository} from "@/app/models/connect";
import {NextResponse} from "next/server";
import {Product} from "@/app/models/entities/Product";
import {Category} from "@/app/models/entities/Category";
import {MoreThan} from "typeorm";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const categoryId: string = (await params).id;
        const productRepo = await initRepository(Product);
        const catRepo = await initRepository(Category);
        const products = await productRepo.find({
            where: {
                category_id: Number(categoryId),
                status: 'active',
                quantity: MoreThan(0)
            }
        });
        const category = await catRepo.findOneBy({id: Number(categoryId)});
        if (!products || !category) {
            return NextResponse.json(
                {
                    result: false,
                    message: "Data not found server"
                },
                { status: 400 }
            );
        }
        return NextResponse.json({ products, category });
    } catch (e) {
        return NextResponse.json(
            {
                result: false,
                message: (e as Error).message
            },
            { status: 500 }
        );
    }
};
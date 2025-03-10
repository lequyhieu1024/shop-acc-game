import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Product} from "@/app/models/entities/Product";
import {ProductImage} from "@/app/models/entities/Image";

export const GET = async (req: NextRequest,  {params } : { params: {id: string}}) => {
    try {
        const productRepo = await initRepository(Product);
        const imageRepo = await initRepository(ProductImage);
        const product = await productRepo.findOneBy({id: Number(params.id)})

        const images = await imageRepo.findBy({product_id: Number(params.id)})

        return NextResponse.json({product, images}, {status: 200})
    } catch (e) {
        return NextResponse.json({
            message: (e as Error).message
        })
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const productRepo = await initRepository(Product);

        const product = await productRepo.findOneBy({ id: Number(params.id) });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        await productRepo.softDelete({ id: Number(params.id) });

        return NextResponse.json(
            { message: "Product and related images deleted successfully" },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { message: (e as Error).message },
            { status: 500 }
        );
    }
};
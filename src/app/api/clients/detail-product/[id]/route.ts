import {NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Product} from "@/app/models/entities/Product";
import {ProductImage} from "@/app/models/entities/Image";

export const GET = async (
    req: Request,
    {params} : {params: Promise<{id: string}>}
) => {
    try {
        const productRepo = await initRepository(Product);
        const imageRepo = await initRepository(ProductImage);
        const productId: string = (await params).id

        const product = await productRepo.findOneBy({ id: Number(productId) });
        if (!product) {
            return NextResponse.json({
                message: "Product not found",
            }, {status: 400})
        }
        const images = await imageRepo.findBy({ product_id: Number(productId) })

        const data = {
            ...product,
            images: images
        };

        return NextResponse.json({
            data
        })
    } catch (e) {
        return NextResponse.json(
            {
                success: false,
                message: "Đã xảy ra lỗi khi cập nhật sản phẩm:" + (e as Error).message,
            },
            { status: 500 }
        );
    }
}
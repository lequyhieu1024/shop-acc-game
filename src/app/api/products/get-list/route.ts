import {initRepository} from "@/app/models/connect";
import {NextResponse} from "next/server";
import {Product} from "@/app/models/entities/Product";

export const GET = async () => {
    try {
        const productRepository = await initRepository(Product);
        const products = await productRepository.find();
        return NextResponse.json({products});
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        })
    }
}

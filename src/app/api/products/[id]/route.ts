import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Product} from "@/app/models/entities/Product";

export const GET = async (req: NextRequest,  {params } : { params: {id: string}}) => {
    try {
        const productRepo = await initRepository(Product);
        const product = await productRepo.findOneBy({id: Number(params.id)})
        return NextResponse.json({product}, {status: 200})
    } catch (e) {
        return NextResponse.json({
            message: (e as Error).message
        })
    }
}
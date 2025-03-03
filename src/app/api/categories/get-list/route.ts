import {initRepository} from "@/app/models/connect";
import {Category} from "@/app/models/entities/Category";
import {NextResponse} from "next/server";

export const GET = async () => {
    try {
        const categoryRepository = await initRepository(Category);
        const categories = await categoryRepository.find();
        return NextResponse.json({categories});
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        })
    }
}

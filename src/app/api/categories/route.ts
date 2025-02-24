import {initRepository} from "@/app/models/connect";
import {Category} from "@/app/models/entities/Category";
import {NextRequest, NextResponse} from "next/server";
import {uploadFileToPinata} from "@/app/services/pinataService";
import {FindOperator, Like} from "typeorm";

interface IFilter {
    name?: FindOperator<string> | undefined,
}

export const GET = async (req: NextRequest) => {
    try {
        const categoryRepository = await initRepository(Category);
        const searchParams: URLSearchParams = req.nextUrl.searchParams
        const size = parseInt(searchParams.get('size') || "10")
        const filter: IFilter = {}
        const name = searchParams.get("name");
        if (name !== null) {
            filter.name = Like(`%${name}%`)
        }
        const categories = await categoryRepository.find({where: filter, take: size})
        return NextResponse.json({categories});
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        })
    }
}

export const POST = async (req: Request): Promise<NextResponse> => {
    try {
        const categoryRepository = await initRepository(Category);
        const data = await req.formData();
        const name = data.get("name") as string
        const image = data.get("image") as File | null
        if (!name || !image) {
            return NextResponse.json({
                result: false,
                message: "Invalid data",
            }, { status: 400 });
        }
        const imgUrl: string | NextResponse = await uploadFileToPinata(image, name);
        const newCategory = categoryRepository.create({name: name , image: imgUrl })
        await categoryRepository.save(newCategory)
        return NextResponse.json({
            category: newCategory
        }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ result: false, message: "Lỗi server", error: (e as Error).message }, { status: 500 });
    }

}
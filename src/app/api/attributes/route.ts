import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Attribute} from "@/app/models/entities/Attribute";

interface IFilter {
    name? : string | null
}

export const GET = async (request: NextRequest) => {
    try {
        const attributeRepo = await initRepository(Attribute)
        const {searchParams} = request.nextUrl
        const filter: IFilter = {};
        if (searchParams.get("name") !== "") {
            filter.name = searchParams.get("name") || null
        }
        const size = parseInt(searchParams.get("size") || "10")

        const attributes = await attributeRepo.find({where: filter, take: size})

        return NextResponse.json({attributes}, {status: 200})
    } catch (e) {
        return NextResponse.json({result: false, message: (e as Error).message}, {status: 500})
    }
}

export const POST = async (request: NextRequest) => {
    try {
        const attributeRepo = await initRepository(Attribute)
        const data : {name: string} = await request.json();
        if (!data.name.trim()) {
            return NextResponse.json({result: false, message: "không được bỏ trống trường name"}, {status: 400})
        }

        const nameArr = data.name.split("|").map(name => name.trim()).filter(name => name);
        const attributes = [];
        for (const name of nameArr) {
            const check = await attributeRepo.findOne({ where: { name } });
            let newAttribute;
            if (check) {
                newAttribute = `Đã có thuộc tính ${name}`;
            } else {
                newAttribute = attributeRepo.create({ name });
                await attributeRepo.save(newAttribute);
            }
            attributes.push(newAttribute);
        }

        return NextResponse.json({ result: true, attributes }, { status: 200 });
    } catch (e) {
        return NextResponse.json({result: false, message: (e as Error).message}, {status: 500})
    }
}
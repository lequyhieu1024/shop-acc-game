import {NextRequest, NextResponse} from "next/server";
import {connectDB} from "@/app/models/connect";
import {Attribute} from "@/app/models/entities/Attribute";

export const GET = async (request: NextRequest, { params }: { params: { id:string } }) => {
    try {
        const attributeRepo = await connectDB(Attribute);
        const attribute = await attributeRepo.findOneBy({id: params.id})
        if (!attribute) {
            return NextResponse.json({
                result: false,
                message: "Attribute not found server"
            }, {status: 400})
        }
        return NextResponse.json({attribute}, {status: 200})
    } catch (e) {
        return NextResponse.json({result: false, message: (e as Error).message}, {status: 500})
    }
}

export const PATCH = async (request: NextRequest, { params } : { params: { id: string } }) => {
    try {
        const attributeRepo = await connectDB(Attribute);
        const newData : {name: string} = await request.json();
        if (!newData.name.trim()) {
            return NextResponse.json({result: false, message: "không được bỏ trống trường name"}, {status: 400})
        }
        await attributeRepo.update(params.id, newData)
        return NextResponse.json({
            result: true,
            message: "update success",
            data: newData
        }, {status: 200})
    } catch (e) {
        return NextResponse.json({result: false, message: (e as Error).message}, {status: 500})
    }
}

export const DELETE = async (request: NextRequest, { params } : { params: { id: string } }) => {
    try {
        const attributeRepo = await connectDB(Attribute);
        await attributeRepo.delete(params.id)
        return NextResponse.json({
            result: true,
            message: "delete success",
        })
    } catch (e) {
        return NextResponse.json({result: false, message: (e as Error).message}, {status: 500})
    }
}

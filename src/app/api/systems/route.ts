import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {System} from "@/app/models/entities/System";

export const GET = async () => {
    try {
        const systemRepo = await initRepository(System)
        const system = await systemRepo.findOneBy({id: 1});
        return NextResponse.json({system}, {status: 200})
    } catch (e) {
        console.log((e as Error).message)
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        })
    }
}

export const PATCH = async (req: NextRequest) => {
    try {
        const systemRepo = await initRepository(System)
        const data = req.formData();
        await systemRepo.update(1, data);
        return NextResponse.json({result: true, data: data}, {status: 200})
    } catch (e) {
        console.log((e as Error).message)
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        })
    }
}
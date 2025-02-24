import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {System} from "@/app/models/entities/System";
import {uploadFileToPinata} from "@/app/services/pinataService";

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
        const formData = await req.formData();
        const newData : any = Object.fromEntries(formData.entries())
        if (newData.image !== null){
            newData.image = await uploadFileToPinata(newData.image)
        }
        console.log(`new data: ${newData}`);

        const result = await systemRepo.update(1, newData);
        console.log(`result: ${result}`);
        return NextResponse.json({system: newData}, {status: 200})
    } catch (e) {
        console.log((e as Error).message)
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        })
    }
}
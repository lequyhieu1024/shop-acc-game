import {initRepository} from "@/app/models/connect";
import {System} from "@/app/models/entities/System";
import {NextResponse} from "next/server";

export const GET = async () => {
    try {
        const systemRepo = await initRepository(System);
        const system = await systemRepo.findOneBy({ id: 1 });
        return NextResponse.json({ system }, { status: 200 });
    } catch (e) {
        console.log((e as Error).message);
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        });
    }
};
import {NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {CardTransaction} from "@/app/models/entities/CardTransaction";

export const GET = async () => {
    try {
        const transRepo = await initRepository(CardTransaction);
        const histories = await transRepo.findBy({user_id: 1}); //default 5, producttion use uid logged in
        return NextResponse.json({histories});
    } catch (e) {
        return NextResponse.json({
            message: (e as Error).message,
        }, {status: 500})
    }
}
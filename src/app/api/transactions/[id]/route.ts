import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {CardTransaction} from "@/app/models/entities/CardTransaction";
import {User} from "@/app/models/entities/User";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const transRepo = await initRepository(CardTransaction)
        const userRepo = await initRepository(User)
        const transaction = await transRepo.findOneBy({id: Number((await params).id)})
        const user = await userRepo.findOneBy({id: transaction?.user_id})
        return NextResponse.json({transaction, user})
    } catch (e) {
        console.log((e as Error).message)
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        }, {status: 500})
    }
}
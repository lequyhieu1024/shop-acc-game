import {NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {CardTransaction} from "@/app/models/entities/CardTransaction";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/auth/auth";

export const GET = async () => {
    try {
        const session = await getServerSession(authOptions);
        const transRepo = await initRepository(CardTransaction);
        const histories = await transRepo.find({
            where: { user_id: session!.user.id },
            order: { created_at: "DESC" }
        });
        return NextResponse.json({histories});
    } catch (e) {
        return NextResponse.json({
            message: (e as Error).message,
        }, {status: 500})
    }
}
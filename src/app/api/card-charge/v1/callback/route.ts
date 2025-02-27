import {initRepository} from "@/app/models/connect";
import {CardTransaction} from "@/app/models/entities/CardTransaction";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const cardTransRepo = await initRepository(CardTransaction)
        const callbackResult = await req.json();

        const transLogs: any = cardTransRepo.findOneBy({request_id: callbackResult.request_id, trans_id: callbackResult.trans_id})
        let transLogUpdated;
        if (callbackResult) {
            transLogUpdated = await cardTransRepo.update(transLogs.id, callbackResult);
        } else {
            transLogs.status = 100;
            transLogs.message = "Gửi thẻ thất bại"
            transLogUpdated = await cardTransRepo.update(transLogs.id ,{status: transLogs.status, message: transLogs.message})
            return NextResponse.json({transLogUpdated}, {status: 400})
        }
        return NextResponse.json({transLogUpdated}, {status: 200})
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        }, {status: 500})
    }
}
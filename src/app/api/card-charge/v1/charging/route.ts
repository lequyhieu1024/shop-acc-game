import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {CardTransaction} from "@/app/models/entities/CardTransaction";
import {cardService} from "@/app/services/cardChargeService";

// khi đổi thẻ, đầu tiên sẽ gọi hàm này và thêm data vào bảng card_transactions, sau đó
export const POST = async (req: NextRequest) => {
    try {
        const cardTransRepo = await initRepository(CardTransaction);

        const data = await req.json();

        if (!data.telco || !data.code || !data.serial || !data.amount) {
            return NextResponse.json({ result: false, message: "Thiếu thông tin bắt buộc!" }, { status: 400 });
        }

        const newTransLog: any = cardTransRepo.create({ ...data, status: 99 });
        await cardTransRepo.save(newTransLog);
        await cardService.chargeCard(data);
        await cardTransRepo.save(newTransLog);
        return NextResponse.json({ result: true, newTransLog }, { status: 200 });
    } catch (e) {
        console.error("Lỗi xử lý nạp thẻ:", e);
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        }, { status: 500 });
    }
};
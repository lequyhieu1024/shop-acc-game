import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { CardTransaction } from "@/app/models/entities/CardTransaction";
import { cardService } from "@/app/services/cardChargeService";
import { isInteger } from "@/app/services/commonService";

// khi đổi thẻ, đầu tiên sẽ gọi hàm này và thêm data vào bảng card_transactions, sau đó api trả về callback
//hàm nhận json, api nhận formData, convert json sang formData trong service
export const POST = async (req: NextRequest) => {
  try {
    const cardTransRepo = await initRepository(CardTransaction);
    const data = await req.json();

    if (!data.telco || !data.code || !data.serial || !data.amount) {
      return NextResponse.json(
        { result: false, message: "Thiếu thông tin bắt buộc!" },
        { status: 400 }
      );
    }

    if (!isInteger(data.code)) {
      return NextResponse.json({
        result: false,
        message: "Mã thẻ phải là số!",
        status: 400
      });
    }

    if (!isInteger(data.serial)) {
      return NextResponse.json({
        result: false,
        message: "Số seri phải là số!",
        status: 400
      });
    }
    const cardRules: Record<string, { code: number; serial?: number }> = {
      VIETTEL: { code: 15, serial: 14 },
      VINAPHONE: { code: 14, serial: 14 },
      MOBIFONE: { code: 12, serial: 15 },
      VNMOBI: { code: 12 },
      GATE: { code: 10, serial: 10 },
      ZING: { code: 9, serial: 12 }
    };

    const rule = cardRules[data.telco.toUpperCase()];
    if (!rule) {
      return NextResponse.json({
        result: false,
        message: "Nhà mạng không hợp lệ!",
        status: 400
      });
    }
    if (data.code.length !== rule.code) {
      return NextResponse.json({
        result: false,
        message: `Mã thẻ của ${data.telco} phải có ${rule.code} ký tự!`,
        status: 400
      });
    }

    if (rule.serial && data.serial.length !== rule.serial) {
      return NextResponse.json({
        result: false,
        message: `Serial của ${data.telco} phải có ${rule.serial} ký tự!`,
        status: 400
      });
    }
    const cardData = await cardService.chargeCard(data);
    if (cardData.status === 3) {
      return NextResponse.json(
        { result: false, message: "Thẻ không hợp lệ!" },
        { status: 400 }
      );
    }
    cardData.user_id = 5; // tạm thời default 1, làm auth xong để user_id logged in
    // thẻ hợp lệ sẽ trả về các data này, lên product comment code này
    // cardData.amount = 1;
    // cardData.value = 1;
    //default khi charge
    cardData.command = "charge";
    const newTransLog = cardTransRepo.create(cardData);
    await cardTransRepo.save(newTransLog);
    return NextResponse.json({ newTransLog }, { status: 200 });
  } catch (e) {
    console.error("Lỗi xử lý nạp thẻ:", e);
    return NextResponse.json(
      {
        result: false,
        message: (e as Error).message
      },
      { status: 500 }
    );
  }
};

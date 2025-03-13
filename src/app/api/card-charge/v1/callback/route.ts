import { initRepository } from "@/app/models/connect";
import { CardTransaction } from "@/app/models/entities/CardTransaction";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/models/entities/User";

// nhận call back
export const POST = async (req: NextRequest) => {
  try {
    const cardTransRepo = await initRepository(CardTransaction);
    const userRepo = await initRepository(User);
    const callbackResult = await req.json();
    if (!callbackResult) {
      return NextResponse.json(
        { message: "Lỗi từ thẻ siêu rẻ api" },
        { status: 400 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transLogs: any = await cardTransRepo.findOneBy({
      request_id: callbackResult.request_id
    });
    if (!transLogs) {
      return NextResponse.json(
        { message: "Không tìm thấy dữ liệu hợp lệ với request_id" },
        { status: 400 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await userRepo.findOneBy({ id: transLogs.id });
    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy dữ liệu user hợp lệ" },
        { status: 400 }
      );
    }
    await cardTransRepo.update(transLogs.id, callbackResult);
    await userRepo.update(transLogs.user_id, {
      balance: user.balance + callbackResult.amount
    });

    return NextResponse.json(
      { result: true, message: "success", data: { user, transLogs } },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        result: false,
        message: (e as Error).message
      },
      { status: 500 }
    );
  }
};

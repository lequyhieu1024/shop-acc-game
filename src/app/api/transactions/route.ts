import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { CardTransaction } from "@/app/models/entities/CardTransaction";
import {Between} from "typeorm";

export const GET = async (req: NextRequest) => {
  try {
    const transRepo = await initRepository(CardTransaction);
    const searchParams: URLSearchParams = req.nextUrl.searchParams;

    const size = parseInt(searchParams.get("size") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * size;

    const status = searchParams.get("status");
    const userCode = searchParams.get("user_code");
    const requestId = searchParams.get("request_id");
    const createdAt = searchParams.get("created_at");

    // Xây dựng điều kiện where
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (requestId) {
      where.request_id = Number(requestId);
    }

    if (createdAt) {
      const startDate = new Date(createdAt);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(createdAt);
      endDate.setHours(23, 59, 59, 999);

      where.created_at = Between(startDate, endDate);
    }

    // Nếu có userCode, cần lọc dựa trên user.user_code
    if (userCode) {
      where.user = { user_code: userCode };
    }

    // Sử dụng findAndCount với relations để lấy dữ liệu
    const [transactions, total] = await transRepo.findAndCount({
      where,
      relations: ["user"], // Tải mối quan hệ user
      select: [
        "id",
        "status",
        "request_id",
        "telco",
        "declared_value",
        "amount",
        "value",
        "created_at",
      ],
      order: { created_at: "DESC" },
      skip,
      take: size,
    });

    // Định dạng lại dữ liệu để khớp với output mong muốn
    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      status: transaction.status,
      request_id: transaction.request_id,
      telco: transaction.telco,
      declared_value: transaction.declared_value,
      amount: transaction.amount,
      value: transaction.value,
      created_at: transaction.created_at,
      user: {
        user_code: transaction.user?.user_code || "N/A",
      },
    }));

    return NextResponse.json({
      transactions: formattedTransactions,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json(
        { result: false, message: "Lỗi server", error: (e as Error).message },
        { status: 500 }
    );
  }
};
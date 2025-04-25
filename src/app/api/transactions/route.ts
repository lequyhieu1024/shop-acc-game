import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { CardTransaction } from "@/app/models/entities/CardTransaction";

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

    const queryBuilder = transRepo
        .createQueryBuilder("transaction")
        .leftJoinAndSelect("users", "user", "user.id = transaction.user_id") // Sử dụng leftJoinAndSelect
        .select([
          "transaction.id",
          "transaction.status",
          "transaction.request_id",
          "transaction.telco",
          "transaction.declared_value",
          "transaction.amount",
          "transaction.value",
          "transaction.created_at",
          "user.user_code",
        ])
        .orderBy("transaction.created_at", "DESC")
        .skip(skip)
        .take(size);

    if (status) {
      queryBuilder.andWhere("transaction.status = :status", { status });
    }

    if (requestId) {
      queryBuilder.andWhere("transaction.request_id = :requestId", { requestId: Number(requestId) });
    }

    if (createdAt) {
      const startDate = new Date(createdAt);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(createdAt);
      endDate.setHours(23, 59, 59, 999);

      queryBuilder.andWhere("transaction.created_at BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      });
    }

    if (userCode) {
      queryBuilder.andWhere("user.user_code = :userCode", { userCode });
    }

    const [transactions, total] = await queryBuilder.getManyAndCount();

    return NextResponse.json({
      transactions,
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
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth";
import { initRepository } from "@/app/models/connect";
import { Order } from "@/app/models/entities/Order";
import { IsNull } from "typeorm";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orderRepository = await initRepository(Order);
        const orders = await orderRepository.find({
            where: { user_id: session.user.id, deleted_at: IsNull() },
            select: [
                "id",
                "total_amount",
                "total_product_price",
                "voucher_discount",
                "voucher",
                "status",
                "payment_status",
                "created_at",
            ],
            relations: ["voucher"], // Lấy thông tin voucher (code)
            order: { created_at: "DESC" }, // Sắp xếp theo thời gian tạo (mới nhất trước)
        });

        const result = orders.map((order) => ({
            id: order.id,
            total_amount: order.total_amount,
            total_product_price: order.total_product_price,
            voucher_discount: order.voucher_discount,
            voucher_code: order.voucher?.code || null,
            status: order.status,
            payment_status: order.payment_status,
            created_at: order.created_at,
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
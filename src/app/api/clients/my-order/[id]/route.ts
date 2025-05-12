import {NextRequest, NextResponse} from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth";
import { initRepository } from "@/app/models/connect";
import { Order } from "@/app/models/entities/Order";
import { IsNull } from "typeorm";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orderId = parseInt((await params).id);
        if (isNaN(orderId)) {
            return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
        }

        const orderRepository = await initRepository(Order);
        const order = await orderRepository.findOne({
            where: { id: orderId, user_id: session.user.id, deleted_at: IsNull() },
            relations: ["items", "items.product", "voucher"],
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const result = {
            id: order.id,
            user_id: order.user_id,
            customer_name: order.customer_name,
            customer_email: order.customer_email,
            customer_phone: order.customer_phone,
            total_amount: order.total_amount,
            total_product_price: order.total_product_price,
            voucher_discount: order.voucher_discount,
            voucher_code: order.voucher?.code || null,
            status: order.status,
            payment_status: order.payment_status,
            created_at: order.created_at,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: order.items?.map((item: any) => ({
                product_id: item.product_id,
                product_name: item.product?.name || "Unknown",
                quantity: item.quantity,
                unit_price: item.unit_price,
            })),
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching order details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
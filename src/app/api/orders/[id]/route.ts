import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Order } from "@/app/models/entities/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth";

const VALID_STATUSES = ["pending", "processing", "completed", "cancelled"];

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.role.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderRepository = await initRepository(Order);
    const order = await orderRepository.findOne({
      where: { id: Number((await params).id) },
      relations: [
        "items",
        "items.product",
        "items.product.category",
        "voucher"
      ],
    });

    if (!order) {
      return NextResponse.json({ error: "Đơn hàng không tồn tại !" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Cập nhật trạng thái đơn hàng
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.role.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderRepository = await initRepository(Order);
    const order = await orderRepository.findOne({
      where: { id: Number((await params).id) },
    });

    if (!order) {
      return NextResponse.json({ error: "Đơn hàng không tồn tại" }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
          { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
          { status: 400 }
      );
    }

    // Cập nhật trạng thái
    if (status) order.status = status;
    order.updated_at = new Date();

    await orderRepository.save(order);

    return NextResponse.json({
      message: "Cập nhật thành công",
      order: {
        id: order.id,
        status: order.status,
        updated_at: order.updated_at,
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
  }
}
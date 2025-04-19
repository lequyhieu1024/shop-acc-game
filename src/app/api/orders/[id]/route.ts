import { initRepository } from "@/app/models/connect";
import { NextResponse } from "next/server";
import { Order } from "@/app/models/entities/Order";
import { OrderItem } from "@/app/models/entities/OrderItem";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const orderId: string = (await params).id;
    const orderRepository = await initRepository(Order);

    const order = await orderRepository.findOne({
      where: { id: Number(orderId) },
      relations: ['items', 'items.product'] // <-- thêm quan hệ ở đây
    });

    if (!order) {
      return NextResponse.json(
        {
          result: false,
          message: "Order not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
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
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const orderRepository = await initRepository(Order);
    const orderItemRepository = await initRepository(OrderItem);
    const orderId: string = (await params).id;

    // Tìm đơn hàng với các items liên quan
    const order = await orderRepository.findOne({
      where: { id: Number(orderId) },
      relations: ["items"],
    });

    if (!order) {
      return NextResponse.json(
        {
          result: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // Lấy dữ liệu JSON từ request
    const newData = await req.json();

    // Cập nhật các trường của Order
    order.customer_name = newData.customer_name || order.customer_name;
    order.customer_email = newData.customer_email || order.customer_email;
    order.customer_phone = newData.customer_phone || order.customer_phone;
    order.status = newData.status || order.status;
    order.payment_method = newData.payment_method || order.payment_method;
    order.payment_status = newData.payment_status || order.payment_status;
    order.total_amount = parseFloat(String(newData.total_amount)) || order.total_amount;

    // Xử lý order_items
    const newOrderItems = newData.order_items || [];

    // Xóa các items hiện có
    await orderItemRepository.delete({ order: { id: Number(orderId) } });

    // Tạo mới items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedOrderItems = newOrderItems.map((item: any) => {
      const orderItem = new OrderItem();
      orderItem.product_id = item.product_id;
      orderItem.quantity = item.quantity;
      orderItem.price = parseFloat(String(item.unit_price));
      orderItem.order = order as Order;
      return orderItem;
    });

    // Lưu items mới
    await orderItemRepository.save(updatedOrderItems);

    // Gán items mới vào order
    order.items = updatedOrderItems;

    // Lưu order đã cập nhật
    await orderRepository.save(order);

    // Manually construct the response to avoid circular reference
    const responseOrder = {
      id: order.id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      status: order.status,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      total_amount: order.total_amount,
      items: updatedOrderItems.map((item: OrderItem) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        // Exclude the 'order' property to break the circular reference
      })),
    };

    return NextResponse.json({
      result: true,
      message: "Order updated successfully",
      order: responseOrder,
    });
  } catch (e) {
    return NextResponse.json(
      {
        result: false,
        message: `Error: ${(e as Error).message}`,
      },
      { status: 500 }
    );
  }
};
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const orderRepo = await initRepository(Order);
    const orderId: string = (await params).id;
    const order = await orderRepo.findOne({
      where: { id: Number(orderId) }
    });
    if (!order) {
      return NextResponse.json(
        {
          result: false,
          message: "Order not found"
        },
        { status: 404 }
      );
    }

    await orderRepo.softDelete(orderId);
    return NextResponse.json(
      {
        result: true,
        message: "Soft delete order successfully!"
      },
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
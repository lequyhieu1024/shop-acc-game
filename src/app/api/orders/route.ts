import { initRepository } from "@/app/models/connect";
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/app/models/entities/Order";
import { OrderItem } from "@/app/models/entities/OrderItem";

export const GET = async () => {
  try {
    const orderRepo = await initRepository(Order);
    const orders = await orderRepo.find();
    
    // Tính tổng số phần tử trong mảng orders
    const total = orders.length;

    return NextResponse.json({
      orders,
      pagination: {
        total,  // Trả về tổng số phần tử
      }
    });
  } catch (e) {
    return NextResponse.json({
      result: false,
      message: (e as Error).message
    });
  }
};
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const orderRepo = await initRepository(Order);
    const orderItemRepo = await initRepository(OrderItem);

    const body = await req.json();

    const orders = Array.isArray(body) ? body : [body];
    const results = [];

    for (const order of orders) {
      const {
        customer_name,
        customer_email,
        customer_phone,
        order_items,
        status,
        payment_method,
        payment_status,
        total_amount,
      } = order;

      const newOrder = await orderRepo.save({
        customer_name,
        customer_email,
        customer_phone,
        status,
        payment_method,
        payment_status,
        total_amount,
      });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      const itemEntities = order_items.map((item: any) =>
        orderItemRepo.create({
          order: newOrder, // ManyToOne(Order)
          product_id: item.product_id, // 👈 Sửa đúng tên field
          quantity: item.quantity,
          price: item.unit_price, // 👈 Bạn dùng unit_price ở FE, backend lưu thành price
        })
      );

      const savedItems = await orderItemRepo.save(itemEntities);

      results.push({
        order: newOrder,
        items: savedItems,
      });
    }

    return NextResponse.json(
      { result: true, message: "Đã tạo đơn hàng", data: results },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { result: false, message: "Lỗi server", error: (e as Error).message },
      { status: 500 }
    );
  }
};
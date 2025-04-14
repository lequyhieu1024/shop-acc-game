import { initRepository } from "@/app/models/connect";
import { NextRequest, NextResponse } from "next/server";
import { OrderItem } from "@/app/models/entities/OrderItem";

export const GET = async () => {
  try {
    const orderRepo = await initRepository(OrderItem);
    const order_items = await orderRepo.find();
    
    // Tính tổng số phần tử trong mảng order_items
    const total = order_items.length;

    return NextResponse.json({
      order_items,
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

// Example of a POST handler for bulk order_items
export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
      const orderRepo = await initRepository(OrderItem);
      const order_items = await req.json();
  
      const newOrders = await orderRepo.save(order_items);
      
      return NextResponse.json(
        { order_items: newOrders },
        { status: 201 }
      );
    } catch (e) {
      return NextResponse.json(
        { result: false, message: "Server error", error: (e as Error).message },
        { status: 500 }
      );
    }
  };
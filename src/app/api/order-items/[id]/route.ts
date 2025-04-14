import { initRepository } from "@/app/models/connect";
import { NextResponse } from "next/server";
import { Order } from "@/app/models/entities/Order";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const orderId: string = (await params).id;
    const orderRepository = await initRepository(Order);
    const order = await orderRepository.findOne({
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
    const orderId: string = (await params).id;
    const order = await orderRepository.findOne({
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

    const formData = await req.formData();
    const newData: Record<string, any> = Object.fromEntries(formData.entries());
    newData.total_amount = parseFloat(newData.total_amount); // Ensure total_amount is a number

    await orderRepository.update(orderId, newData);
    return NextResponse.json({
      result: true,
      message: "Order updated successfully",
      order: { ...order, ...newData }
    });
  } catch (e) {
    return NextResponse.json(
      { result: false, message: `Error: ${(e as Error).message}` },
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
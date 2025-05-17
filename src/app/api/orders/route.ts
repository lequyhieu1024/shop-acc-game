import { initRepository } from "@/app/models/connect";
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/app/models/entities/Order";
import { OrderItem } from "@/app/models/entities/OrderItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth";
import { User } from "@/app/models/entities/User";
import { Product } from "@/app/models/entities/Product";
import { PaymentStatus, OrderStatus } from "@/app/models/entities/Order";

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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { 
      customer_name, 
      customer_email, 
      customer_phone, 
      total_amount, 
      payment_method,
      order_items 
    } = await request.json();

    // Validate input
    if (!customer_name || !customer_email || !customer_phone || !total_amount || !order_items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize repositories
    const userRepository = await initRepository(User);
    const productRepository = await initRepository(Product);
    const orderRepository = await initRepository(Order);
    const orderItemRepository = await initRepository(OrderItem);

    // Get user and check balance
    const user = await userRepository.findOne({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.balance < total_amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Check product quantities
    for (const item of order_items) {
      const product = await productRepository.findOne({
        where: { id: item.product_id }
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.product_id} not found` },
          { status: 404 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient quantity for product ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Start transaction
    const queryRunner = orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create order
      const order = orderRepository.create({
        user_id: session.user.id,
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        payment_method,
        payment_status: PaymentStatus.PAID,
        status: OrderStatus.PROCESSING
      });
      await queryRunner.manager.save(order);

      // 2. Create order items and update product quantities
      for (const item of order_items) {
        // Create order item - Fix here: use item.price instead of item.unit_price
        const orderItem = orderItemRepository.create({
          order: order,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price  // Changed from item.unit_price to item.price
        });
        await queryRunner.manager.save(orderItem);

        // Update product quantity
        await queryRunner.manager.update(
          Product,
          { id: item.product_id },
          { quantity: () => `quantity - ${item.quantity}` }
        );
      }

      // 3. Update user balance
      await queryRunner.manager.update(
        User,
        { id: session.user.id },
        { balance: () => `balance - ${total_amount}` }
      );

      // Commit transaction
      await queryRunner.commitTransaction();

      return NextResponse.json({ 
        result: true,
        message: "Order created successfully",
        order_id: order.id
      });
    } catch (error) {  
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      console.error("Error creating order:", error);
      return NextResponse.json(
        { error: "Error creating order: " + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      );
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
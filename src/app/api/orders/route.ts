import { initRepository } from "@/app/models/connect";
import { NextResponse } from "next/server";
import { Order } from "@/app/models/entities/Order";
import { OrderItem } from "@/app/models/entities/OrderItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth";
import { User } from "@/app/models/entities/User";
import { Product } from "@/app/models/entities/Product";
import { PaymentStatus, OrderStatus } from "@/app/models/entities/Order";
import {Like} from "typeorm";
import { sendTelegramMessage2} from "@/app/services/commonService";


export const GET = async (request: Request) => {
  try {
    const orderRepo = await initRepository(Order);
    const { searchParams } = new URL(request.url);

    // Lấy các tham số lọc từ query
    const customerName = searchParams.get("customer_name") || "";
    const status = searchParams.get("status") || "";
    // const minAmount = parseFloat(searchParams.get("min_amount") || "0");
    // const maxAmount = parseFloat(searchParams.get("max_amount") || "Infinity");
    const paymentStatus = searchParams.get("payment_status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Xây dựng điều kiện lọc
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (customerName) {
      where.customer_name = Like(`%${customerName}%`) ;
    }
    if (status) {
      where.status = status;
    }
    // if (minAmount || maxAmount !== Infinity) {
    //   where.total_amount = {};
    //   if (minAmount) {
    //     where.total_amount[">="] = minAmount;
    //   }
    //   if (maxAmount !== Infinity) {
    //     where.total_amount["<="] = maxAmount;
    //   }
    // }
    if (paymentStatus) {
      where.payment_status = paymentStatus;
    }

    // Thực hiện truy vấn với phân trang và lọc
    const [orders, total] = await orderRepo.findAndCount({
      where,
      order: {
        id: "DESC",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      orders,
      pagination: {
        total,
        current: page,
        pageSize: limit,
      },
    });
  } catch (e) {
    return NextResponse.json({
      result: false,
      message: (e as Error).message,
    }, { status: 500 });
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
        { error: "Số dư không đủ" },
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
          { error: `Sản phẩm ${item.product_id} không tồn tại` },
          { status: 404 }
        );
      }

      if (!product.is_for_sale) {
        return NextResponse.json(
            { error: `Sản phẩm ${product.name} không dành cho bạn, vui lòng liên hệ quản trị viên để có thể mua` },
            { status: 400 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Sản phẩm ${product.name} đã hết hàng, vui lòng liên hệ quản trị viên hoặc đợi` },
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
        status: OrderStatus.PENDING
      });
      await queryRunner.manager.save(order);

      // 2. Create order items and update product quantities
      for (const item of order_items) {
        // Create order item
        const orderItem = orderItemRepository.create({
          order: order,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price
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

      await sendTelegramMessage2(
          customer_name,
          customer_phone,
      );

      return NextResponse.json({ 
        result: true,
        message: "Tạo đơn hàng thành công, chờ quản trị viên liên hệ sau !",
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error("Có lỗi sảy ra khi tạo đơn hàng:", error);
    return NextResponse.json(
      { error: "Lỗi Server 500 !" },
      { status: 500 }
    );
  }
}
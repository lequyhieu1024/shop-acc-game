import { initRepository } from "@/app/models/connect";
import { NextResponse } from "next/server";
import { Order } from "@/app/models/entities/Order";
import { OrderItem } from "@/app/models/entities/OrderItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth";
import { User } from "@/app/models/entities/User";
import { Product } from "@/app/models/entities/Product";
import { PaymentStatus, OrderStatus } from "@/app/models/entities/Order";
import {IsNull, Like} from "typeorm";
import { sendTelegramMessage2} from "@/app/services/commonService";
import {Voucher} from "@/app/models/entities/Voucher";


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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      customer_name,
      customer_email,
      customer_phone,
      total_amount,
      payment_method,
      order_items,
      voucher_code,
    } = await request.json();

    if (!customer_name || !customer_email || !customer_phone || !total_amount || !order_items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userRepository = await initRepository(User);
    const productRepository = await initRepository(Product);
    const orderRepository = await initRepository(Order);
    const orderItemRepository = await initRepository(OrderItem);
    const voucherRepository = await initRepository(Voucher);

    const user = await userRepository.findOne({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let voucherDiscount = 0;
    let voucher;
    let voucherId: number | null = null;
    if (voucher_code) {
      voucher = await voucherRepository.findOne({ where: { code: voucher_code, deleted_at: null } });
      if (!voucher) {
        return NextResponse.json({ error: "Mã voucher không tồn tại" }, { status: 400 });
      }
      if (voucher.status !== 'active') {
        return NextResponse.json({ error: "Voucher không hoạt động" }, { status: 400 });
      }
      const now = new Date();
      if (now < voucher.issue_date || now > voucher.expired_date) {
        return NextResponse.json({ error: "Voucher đã hết hạn hoặc chưa bắt đầu" }, { status: 400 });
      }
      if (voucher.quantity <= 0) {
        return NextResponse.json({ error: "Voucher đã hết số lượng" }, { status: 400 });
      }
      voucherDiscount = Number(voucher.value);
      voucherId = voucher.id;

      const isExistingVoucher = await orderRepository.findOneBy({
        voucher_id: voucher.id,
        user_id: session!.user.id,
        deleted_at: IsNull(),
      });

      if (isExistingVoucher) {
        return NextResponse.json(
            { result: false, message: "Bạn đã dùng voucher này rồi" },
            { status: 400 }
        );
      }
    }

    const totalProductPrice = order_items.reduce(
        (sum: number, item: { unit_price: number; quantity: number }) => sum + item.unit_price * item.quantity,
        0
    );
    const finalAmount = totalProductPrice - (voucherDiscount||0);

    if (user.balance < finalAmount) {
      return NextResponse.json({ error: "Số dư không đủ" }, { status: 400 });
    }

    for (const item of order_items) {
      const product = await productRepository.findOne({ where: { id: item.product_id } });
      if (!product) {
        return NextResponse.json({ error: `Sản phẩm ${item.product_id} không tồn tại` }, { status: 404 });
      }
      if (!product.is_for_sale) {
        return NextResponse.json(
            { error: `Sản phẩm ${product.name} không dành cho bạn, vui lòng liên hệ quản trị viên để có thể mua !` },
            { status: 400 }
        );
      }
      if (product.quantity < item.quantity) {
        return NextResponse.json(
            { error: `Sản phẩm ${product.name} không đủ số lượng trong kho, vui lòng liên hệ quản trị viên hoặc chờ thêm !` },
            { status: 400 }
        );
      }
    }

    const queryRunner = orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = orderRepository.create({
        user_id: session.user.id,
        customer_name,
        customer_email,
        customer_phone,
        total_amount: finalAmount,
        total_product_price: totalProductPrice,
        voucher_discount: voucherDiscount,
        voucher_id: voucherId,
        payment_method,
        payment_status: PaymentStatus.PAID,
        status: OrderStatus.PENDING,
      });
      await queryRunner.manager.save(order);

      for (const item of order_items) {
        const orderItem = orderItemRepository.create({
          order: order,
          product_id: item.product_id,
          quantity: item.quantity,
          price: Number(item.unit_price),
        });
        await queryRunner.manager.save(orderItem);

        await queryRunner.manager.update(
            Product,
            { id: item.product_id },
            { quantity: () => `quantity - ${item.quantity}` }
        );
      }

      await queryRunner.manager.update(
          User,
          { id: session.user.id },
          { balance: () => `balance - ${finalAmount}` }
      );

      if (voucher) {
        await queryRunner.manager.update(
            Voucher,
            { id: voucher.id },
            { quantity: () => `quantity - 1` }
        );
      }

      await queryRunner.commitTransaction();

      await sendTelegramMessage2(customer_name, customer_phone);

      return NextResponse.json({
        result: true,
        message: "Tạo đơn hàng thành công, chờ quản trị viên liên hệ sau !",
      });
    } catch (error) {
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
    console.error("Có lỗi xảy ra khi tạo đơn hàng:", error);
    return NextResponse.json({ error: "Lỗi Server 500 !" }, { status: 500 });
  }
}
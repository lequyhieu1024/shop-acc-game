import { NextResponse } from "next/server";
import { MoreThan } from "typeorm";
import { Order, OrderStatus } from "../../models/entities/Order";
import { OrderItem } from "../../models/entities/OrderItem";
import { Product, SystemStatus } from "../../models/entities/Product";
import { User } from "../../models/entities/User";
import { CardTransaction, CardStatus } from "../../models/entities/CardTransaction";
import { initRepository } from "../../models/connect";

function getStartOf(unit: "month" | "quarter" | "week", date = new Date()) {
  const d = new Date(date);
  if (unit === "month") {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (unit === "quarter") {
    const q = Math.floor(d.getMonth() / 3);
    d.setMonth(q * 3, 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (unit === "week") {
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return d;
}

async function getHistoricalRevenue(months = 6) {
  const orderRepo = await initRepository(Order);
  const revenueByMonth = [];
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const start = getStartOf("month", date);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    const revenue = await orderRepo
        .createQueryBuilder("order")
        .select("SUM(order.total_amount)", "revenue")
        .where("order.status = :status", { status: OrderStatus.COMPLETED })
        .andWhere("order.created_at >= :start AND order.created_at <= :end", { start, end })
        .getRawOne();
    revenueByMonth.push({
      month: date.toLocaleString("vi-VN", { month: "short", year: "numeric" }),
      revenue: Number(revenue?.revenue || 0),
    });
  }
  return revenueByMonth.reverse(); // Oldest to newest
}

async function getHistoricalUsers(months = 6) {
  const userRepo = await initRepository(User);
  const usersByMonth = [];
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const start = getStartOf("month", date);
    const newUsers = await userRepo.count({
      where: { created_at: MoreThan(start) },
    });
    usersByMonth.push({
      month: date.toLocaleString("vi-VN", { month: "short", year: "numeric" }),
      newUsers,
    });
  }
  return usersByMonth.reverse(); // Oldest to newest
}

export async function GET() {
  try {
    const orderRepo = await initRepository(Order);
    const productRepo = await initRepository(Product);
    const orderItemRepo = await initRepository(OrderItem);
    const userRepo = await initRepository(User);
    const cardRepo = await initRepository(CardTransaction);

    const now = new Date();
    const startOfMonth = getStartOf("month", now);
    const startOfWeek = getStartOf("week", now);

    // Revenue
    const [revenueMonth, revenueWeek, historicalRevenue] = await Promise.all([
      orderRepo
          .createQueryBuilder("order")
          .select("SUM(order.total_amount)", "revenue")
          .where("order.status = :status", { status: OrderStatus.COMPLETED })
          .andWhere("order.created_at >= :start", { start: startOfMonth })
          .getRawOne(),
      orderRepo
          .createQueryBuilder("order")
          .select("SUM(order.total_amount)", "revenue")
          .where("order.status = :status", { status: OrderStatus.COMPLETED })
          .andWhere("order.created_at >= :start", { start: startOfWeek })
          .getRawOne(),
      getHistoricalRevenue(),
    ]);

    // Products
    const [totalAcc, accSold, accAvailable, topAcc] = await Promise.all([
      productRepo.count(),
      productRepo.count({ where: { is_for_sale: false } }),
      productRepo.count({ where: { is_for_sale: true, status: SystemStatus.ACTIVE } }),
      orderItemRepo
          .createQueryBuilder("item")
          .select("item.product_id", "product_id")
          .addSelect("product.name", "product_name")
          .addSelect("COUNT(item.id)", "sold_count")
          .leftJoin("item.product", "product")
          .where("product.name IS NOT NULL")
          .groupBy("item.product_id")
          .addGroupBy("product.name")
          .orderBy("sold_count", "DESC")
          .limit(5)
          .getRawMany(),
    ]);

    const [totalOrders, completedOrders, pendingOrders, processingOrders, failedOrders, cancelledOrders] =
        await Promise.all([
          orderRepo.count(),
          orderRepo.count({ where: { status: OrderStatus.COMPLETED } }),
          orderRepo.count({ where: { status: OrderStatus.PENDING } }),
          orderRepo.count({ where: { status: OrderStatus.PROCESSING } }),
          orderRepo.count({ where: { status: OrderStatus.FAILED } }),
          orderRepo.count({ where: { status: OrderStatus.CANCELLED } }),
        ]);

    const [totalUsers, newUsersThisMonth, historicalUsers] = await Promise.all([
      userRepo.count(),
      userRepo.count({ where: { created_at: MoreThan(startOfMonth) } }),
      getHistoricalUsers(),
    ]);

    const transactions = await cardRepo.find({
      where: { status: CardStatus.SUCCESS_CORRECT },
      relations: ["user"],
    });
    const validTransactions = transactions.filter((transaction) => transaction.user); // Filter out null users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userTotals = validTransactions.reduce((acc: any, transaction: any) => {
      const userId = transaction.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          total_amount: 0,
          username: transaction.user.username || `${userId}`,
          user_code: transaction.user.user_code || "N/A",
          phone: transaction.user.phone || "N/A",
        };
      }
      acc[userId].total_amount += Number(transaction.amount || 0);
      return acc;
    }, {});

    const topCard = Object.values(userTotals)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sort((a: any, b: any) => b.total_amount - a.total_amount)
        .slice(0, 5);

    return NextResponse.json({
      revenue: {
        month: Number(revenueMonth?.revenue || 0),
        week: Number(revenueWeek?.revenue || 0),
        quarter: 0, // Not calculated; included for interface compatibility
        historical: historicalRevenue,
      },
      acc: {
        total: totalAcc,
        sold: accSold,
        available: accAvailable,
        locked: 0, // Not calculated; adjust if needed
        top: topAcc,
      },
      orders: {
        total: totalOrders,
        completed: completedOrders,
        processing: processingOrders,
        failed: failedOrders,
        pending: pendingOrders,
        cancelled: cancelledOrders,
      },
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        historical: historicalUsers,
      },
      topCard,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê:", error);
    return NextResponse.json(
        { result: false, message: (error as Error).message },
        { status: 500 }
    );
  }
}
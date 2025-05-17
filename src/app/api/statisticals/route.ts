import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { 
  Order, 
  OrderItem, 
  Product, 
  Category, 
  User, 
  UserView, 
  CardTransaction,
} from "@/app/models/entities/index";

// Định nghĩa kiểu cho paymentSummary
type PaymentSummary = {
  paid: number;
  unpaid: number;
  waiting_confirmation: number;
  pending_third_party: number;
  failed: number;
  refunded: number;
  cancelled: number;
};

// Định nghĩa kiểu cho orderSummary
type OrderSummary = {
  completed: number;
  processing: number;
  failed: number;
  pending: number;
  cancelled: number;
};

export async function GET(req: NextRequest) {
  try {
    // Khởi tạo các repository với error handling riêng
    const initializeRepos = async () => {
      try {
        const [
          orderRepo, 
          orderItemRepo, 
          productRepo, 
          categoryRepo, 
          userRepo, 
          userViewRepo, 
          cardTransactionRepo
        ] = await Promise.all([
          initRepository(Order),
          initRepository(OrderItem),
          initRepository(Product),
          initRepository(Category),
          initRepository(User),
          initRepository(UserView),
          initRepository(CardTransaction)
        ]);
        
        return {
          orderRepo,
          orderItemRepo,
          productRepo,
          categoryRepo,
          userRepo,
          userViewRepo,
          cardTransactionRepo
        };
      } catch (err) {
        console.error("Repository initialization failed:", err);
        throw new Error("Database connection failed");
      }
    };

    const repositories = await initializeRepos();
    const {
      orderRepo,
      orderItemRepo,
      productRepo,
      userRepo,
      userViewRepo,
      cardTransactionRepo
    } = repositories;

    // Xử lý query parameters
    const { searchParams } = new URL(req.url);
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const category_id = searchParams.get("category_id");

    // 1. Thống kê doanh thu
    const revenueData = await (async () => {
      // Tổng doanh thu
      const revenueQuery = orderRepo
        .createQueryBuilder("order")
        .select("SUM(order.total_amount)", "total_revenue")
        .where("order.payment_status = :status", { status: "paid" });

      if (start_date && end_date) {
        revenueQuery.andWhere("order.created_at BETWEEN :start AND :end", {
          start: start_date,
          end: end_date,
        });
      }

      const totalRevenueResult = await revenueQuery.getRawOne();
      const totalRevenue = parseFloat(totalRevenueResult?.total_revenue || "0");

      // Doanh thu theo category
      let revenueByCategoryQuery = orderRepo
      .createQueryBuilder("order")
      .innerJoin("order.items", "order_item")
      .innerJoin("order_item.product", "product")
      .innerJoin("product.category", "category")
      .select([
        "category.id AS category_id",
        "category.name AS category_name",
        "SUM(order.total_amount) AS total_revenue",
      ])
      .where("order.payment_status = :status", { status: "paid" })
      .groupBy("category.id, category.name"); // Thêm GROUP BY
    
    if (category_id) {
      revenueByCategoryQuery = revenueByCategoryQuery.andWhere(
        "category.id = :category_id",
        { category_id }
      );
    }
    if (start_date && end_date) {
      revenueByCategoryQuery = revenueByCategoryQuery.andWhere(
        "order.created_at BETWEEN :start AND :end",
        { start: start_date, end: end_date }
      );
    }
    
    const revenueByCategory = await revenueByCategoryQuery.getRawMany();

      // Doanh thu theo payment method
      const revenueByPaymentMethod = await orderRepo
        .createQueryBuilder("order")
        .select([
          "order.payment_method AS payment_method",
          "SUM(order.total_amount) AS total_revenue",
        ])
        .where("order.payment_status = :status", { status: "paid" })
        .groupBy("order.payment_method")
        .getRawMany();

      // Lợi nhuận
      const profitQuery = orderRepo
        .createQueryBuilder("order")
        .innerJoin("order.items", "order_item")
        .innerJoin("order_item.product", "product")
        .select(
          "SUM((product.sale_price - product.regular_price) * order_item.quantity)",
          "total_profit"
        )
        .where("order.payment_status = :status", { status: "paid" });

      if (start_date && end_date) {
        profitQuery.andWhere("order.created_at BETWEEN :start AND :end", {
          start: start_date,
          end: end_date,
        });
      }

      const profitResult = await profitQuery.getRawOne();
      const totalProfit = parseFloat(profitResult?.total_profit || "0");

      return {
        total_revenue: totalRevenue,
        by_category: revenueByCategory,
        by_payment_method: revenueByPaymentMethod,
        total_profit: totalProfit,
      };
    })();

    // 2. Thống kê tài khoản game
    const accountsData = await (async () => {
      // Tổng số tài khoản
      const totalAccounts = await productRepo
        .createQueryBuilder("product")
        .select("COUNT(*)", "count")
        .where("product.status = :status", { status: "active" })
        .getRawOne();

      // Số acc đã bán
      const soldAccounts = await productRepo
        .createQueryBuilder("product")
        .innerJoin("product.orderItems", "order_item")
        .innerJoin("order_item.order", "order")
        .select("COUNT(DISTINCT product.id)", "count")
        .where("order.payment_status = :status", { status: "paid" })
        .getRawOne();

      // Số acc còn lại
      const remainingAccounts = await productRepo
        .createQueryBuilder("product")
        .leftJoin("product.orderItems", "order_item")
        .leftJoin(
          "order_item.order",
          "order",
          "order.id = order_item.order_id AND order.payment_status = :status",
          { status: "paid" }
        )
        .select("COUNT(DISTINCT product.id)", "count")
        .where("product.status = :status", { status: "active" })
        .andWhere("order.id IS NULL")
        .getRawOne();

      // Số acc bị khóa
      const lockedAccounts = await productRepo
        .createQueryBuilder("product")
        .select("COUNT(*)", "count")
        .where("product.status = :status", { status: "inactive" })
        .getRawOne();

      // Thống kê theo category
      const accountsByCategory = await productRepo
        .createQueryBuilder("product")
        .innerJoin("product.category", "category")
        .select([
          "category.id AS category_id",
          "category.name AS category_name",
          "COUNT(product.id) AS total_accounts",
        ])
        .groupBy("category.id, category.name")
        .getRawMany();

      // Top acc bán chạy
      const topSellingAccounts = await orderItemRepo
        .createQueryBuilder("order_item")
        .innerJoin("order_item.order", "order")
        .innerJoin("order_item.product", "product")
        .select([
          "product.id AS product_id",
          "product.name AS product_name",
          "SUM(order_item.quantity) AS total_sold",
        ])
        .where("order.payment_status = :status", { status: "paid" })
        .groupBy("product.id, product.name")
        .orderBy("total_sold", "DESC")
        .limit(5)
        .getRawMany();

      // Số acc mới
      let newAccountsQuery = productRepo
        .createQueryBuilder("product")
        .select("COUNT(*)", "count");

      if (start_date && end_date) {
        newAccountsQuery = newAccountsQuery.where(
          "product.created_at BETWEEN :start AND :end",
          { start: start_date, end: end_date }
        );
      }

      const newAccountsResult = await newAccountsQuery.getRawOne();

      return {
        total: parseInt(totalAccounts?.count || "0"),
        sold: parseInt(soldAccounts?.count || "0"),
        remaining: parseInt(remainingAccounts?.count || "0"),
        locked: parseInt(lockedAccounts?.count || "0"),
        by_category: accountsByCategory,
        top_selling: topSellingAccounts,
        new_accounts: parseInt(newAccountsResult?.count || "0"),
      };
    })();

    // 3. Thống kê đơn hàng
    const ordersData = await (async () => {
      const orderStats = await orderRepo
        .createQueryBuilder("order")
        .select("order.status, COUNT(*) AS count")
        .groupBy("order.status")
        .getRawMany();

      const orderSummary: OrderSummary = {
        completed: 0,
        processing: 0,
        failed: 0,
        pending: 0,
        cancelled: 0,
      };

      orderStats.forEach((stat: { order_status: string; count: string }) => {
        if (stat.order_status in orderSummary) {
          orderSummary[stat.order_status as keyof OrderSummary] = parseInt(stat.count);
        }
      });

      const successRate =
        orderSummary.completed /
        (orderSummary.completed +
          orderSummary.failed +
          orderSummary.cancelled +
          orderSummary.pending +
          orderSummary.processing);

      return {
        summary: orderSummary,
        success_rate: isNaN(successRate) ? 0 : successRate,
      };
    })();

    // 4. Thống kê thanh toán
    const paymentsData = await (async () => {
      const paymentStats = await orderRepo
        .createQueryBuilder("order")
        .select("order.payment_status, COUNT(*) AS count")
        .groupBy("order.payment_status")
        .getRawMany();

      const paymentSummary: PaymentSummary = {
        paid: 0,
        unpaid: 0,
        waiting_confirmation: 0,
        pending_third_party: 0,
        failed: 0,
        refunded: 0,
        cancelled: 0,
      };

      paymentStats.forEach((stat: { order_payment_status: string; count: string }) => {
        if (stat.order_payment_status in paymentSummary) {
          paymentSummary[stat.order_payment_status as keyof PaymentSummary] = parseInt(stat.count);
        }
      });

      const refundRate =
        paymentSummary.refunded /
        (paymentSummary.paid + paymentSummary.failed + paymentSummary.cancelled);

      // Thống kê card transaction
      const cardTransactionStats = await cardTransactionRepo
        .createQueryBuilder("card_transaction")
        .select("card_transaction.status, COUNT(*) AS count")
        .groupBy("card_transaction.status")
        .getRawMany();

      const cardTransactionSummary: Record<string, number> = {};
      cardTransactionStats.forEach((stat: { card_transaction_status: string; count: string }) => {
        cardTransactionSummary[stat.card_transaction_status] = parseInt(stat.count);
      });

      return {
        summary: paymentSummary,
        refund_rate: isNaN(refundRate) ? 0 : refundRate,
        card_transactions: cardTransactionSummary,
      };
    })();

    // 5. Thống kê truy cập
    const visitsData = await (async () => {
      let visitsQuery = userViewRepo
        .createQueryBuilder("user_view")
        .select("COUNT(*)", "count");

      if (start_date && end_date) {
        visitsQuery = visitsQuery.where(
          "user_view.created_at BETWEEN :start AND :end",
          { start: start_date, end: end_date }
        );
      }

      const totalVisitsResult = await visitsQuery.getRawOne();

      // Truy cập theo ngày
      const visitsByDay = await userViewRepo
        .createQueryBuilder("user_view")
        .select("DATE(user_view.created_at) AS visit_date, COUNT(*) AS visit_count")
        .groupBy("DATE(user_view.created_at)")
        .orderBy("visit_date", "ASC")
        .getRawMany();

      return {
        total: parseInt(totalVisitsResult?.count || "0"),
        by_day: visitsByDay,
      };
    })();

    // 6. Thống kê người dùng
    const usersData = await (async () => {
      let newUsersQuery = userRepo
        .createQueryBuilder("user")
        .select("COUNT(*)", "count");

      if (start_date && end_date) {
        newUsersQuery = newUsersQuery.where(
          "user.created_at BETWEEN :start AND :end",
          { start: start_date, end: end_date }
        );
      }

      const newUsersResult = await newUsersQuery.getRawOne();

      // Tỷ lệ chuyển đổi
      const totalBuyers = await orderRepo
        .createQueryBuilder("order")
        .select("COUNT(DISTINCT order.user_id)", "count")
        .where("order.payment_status = :status", { status: "paid" })
        .getRawOne();

      const conversionRate =
        visitsData.total > 0
          ? parseInt(totalBuyers?.count || "0") / visitsData.total
          : 0;

      return {
        new_users: parseInt(newUsersResult?.count || "0"),
        conversion_rate: isNaN(conversionRate) ? 0 : conversionRate,
      };
    })();

    // Trả về response
    return NextResponse.json({
      revenue: revenueData,
      accounts: accountsData,
      orders: ordersData,
      payments: paymentsData,
      visits: visitsData,
      users: usersData,
    });

  } catch (error) {
    console.error("Error in statistical API:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
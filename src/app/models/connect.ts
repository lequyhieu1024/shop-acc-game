import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  Category,
  Product,
  Voucher,
  UserVoucher,
  LuckyDraw,
  LuckyDrawItem,
  System,
  UserView,
  User,
  ProductImage,
  Banner,
  CardTransaction,
  Contact,
  NotificationBanner,
  Order,
  OrderItem,
} from "@/app/models/entities";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DATABASE_NAME,
  entities: [
    Category,
    Product,
    Voucher,
    UserVoucher,
    LuckyDraw,
    LuckyDrawItem,
    System,
    UserView,
    User,
    ProductImage,
    Banner,
    CardTransaction,
    Contact,
    NotificationBanner,
    Order,
    OrderItem,
  ],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
  logging: process.env.NODE_ENV !== "production",
  charset: "utf8mb4_unicode_ci",
  extra: {
    connectionLimit: 10,
  },
});

// Optional: initDB helper
export const initRepository = async (entity: any) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
      .then(() => console.log("✅ TypeORM đã kết nối tới database!"))
      .catch((err) => console.error("❌ Lỗi kết nối:", err));
  }
  return AppDataSource.getRepository(entity);
};

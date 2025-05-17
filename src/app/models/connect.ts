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
  synchronize: false,
  logging: false
});

// Optional: initDB helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initRepository = async (entity: any) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
      .then(() => console.log("✅ TypeORM đã kết nối tới database!"))
      .catch((err) => console.error("❌ Lỗi kết nối:", err));
  }
  return AppDataSource.getRepository(entity);
};

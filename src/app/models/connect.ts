import "reflect-metadata";
import { DataSource } from "typeorm";
import { Category } from "@/app/models/entities/Category";
import { Product } from "@/app/models/entities/Product";
import { Voucher } from "@/app/models/entities/Voucher";
import { UserVoucher } from "@/app/models/entities/UserVoucher";
import { LuckyDraw } from "@/app/models/entities/LuckyDraw";
import { LuckyDrawItem } from "@/app/models/entities/LuckyDrawItem";
import { System } from "@/app/models/entities/System";
import { User } from "@/app/models/entities/User";
import { UserView } from "@/app/models/entities/UserView";
import { ProductImage } from "@/app/models/entities/Image";
import { Banner } from "@/app/models/entities/Banner";
import { CardTransaction } from "@/app/models/entities/CardTransaction";
import { Contact } from "./entities/Contact";
import { NotificationBanner } from "./entities/NotificationBanner";
import { OrderItem } from "./entities/OrderItem";
import { Order } from "./entities/Order";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
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
  logging: true
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initRepository = async (entity: any) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
      .then(() => console.log("✅ TypeORM đã kết nối tới database!"))
      .catch((err) => console.error("❌ Lỗi kết nối:", err));
  }
  return AppDataSource.getRepository(entity);
};

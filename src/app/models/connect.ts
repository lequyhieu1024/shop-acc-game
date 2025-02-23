import "reflect-metadata";
import { DataSource } from "typeorm";
import {Category} from "@/app/models/entities/Category";
import {Attribute} from "@/app/models/entities/Attribute";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: Number(process.env.DATABASE_PORT),
    username: "root",
    password: "",
    database: process.env.DATABASE_NAME,
    entities: [Category, Attribute],
    synchronize: true,
    logging: true,
});

export const connectDB = async (entity: any) => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize()
            .then(() => console.log("✅ TypeORM đã kết nối tới database!"))
            .catch((err) => console.error("❌ Lỗi kết nối:", err));
    }
    return AppDataSource.getRepository(entity)
};

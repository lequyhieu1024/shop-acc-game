import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./User";
import {Product} from "@/app/models/entities/Product";

@Entity({ name: "user_views" })
export class UserView {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "product_id" })
    product!: Product;
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product"; // import thêm nếu chưa có

@Entity({ name: "order_items" })
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
    order: Order | undefined;

    @Column({ type: "int", nullable: false })
    product_id!: number;

    @ManyToOne(() => Product, { eager: false })
    @JoinColumn({ name: "product_id" })
    product: Product | undefined;

    @Column({ type: "int", nullable: false })
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price!: number;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

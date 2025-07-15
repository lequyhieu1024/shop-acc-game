import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany, ManyToOne, JoinColumn
} from "typeorm";
import { OrderItem } from "./OrderItem";
import {Voucher} from "./Voucher";

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    FAILED = 'failed'
}

export const statusLabels: Record<string, string> = {
    pending: "Chờ xử lý",
    processing: "Đang bàn giao nick",
    completed: "Đã bàn giao nick",
    cancelled: "Hủy đơn",
    failed: "Có lỗi",
};

export enum PaymentMethod {
    CASH = 'cash',
    BANK_TRANSFER = 'bank_transfer', //ATM
    THIRD_PARTY = 'third_party'    // CARD
}

export enum PaymentStatus {
    UNPAID = 'unpaid',
    PAID = 'paid',
}

@Entity({ name: "orders" })
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", nullable: true })
    user_id!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    customer_name!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    customer_email!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    customer_phone!: string;

    @Column({ type: "bigint",nullable:true })
    total_amount?: number;

    @Column({ type: "bigint",nullable:true })
    total_product_price?: number;

    @Column({ type: "bigint",nullable:true })
    voucher_discount?: number;

    @Column({ type: 'bigint', nullable: false })
    voucher_id?: number;

    @ManyToOne(() => Voucher, voucher => voucher.orders, { eager: false })
    @JoinColumn({ name: "voucher_id" })
    voucher: Voucher | undefined;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status!: OrderStatus;

    @Column({
        type: "enum",
        enum: PaymentMethod
    })
    payment_method!: PaymentMethod;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.UNPAID
    })
    payment_status!: PaymentStatus;

    @OneToMany(() => OrderItem, item => item.order, { cascade: true })
    items: OrderItem[] | undefined;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

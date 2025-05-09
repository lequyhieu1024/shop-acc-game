import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from "typeorm";
import { OrderItem } from "./OrderItem";

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
    BANK_TRANSFER = 'bank_transfer',
    MANUAL = 'manual',             // thanh toán thủ công (Zalo, tin nhắn...)
    THIRD_PARTY = 'third_party'    // ví điện tử, cổng nạp bên thứ 3
}

export enum PaymentStatus {
    UNPAID = 'unpaid',
    WAITING_CONFIRMATION = 'waiting_confirmation', // dành cho thanh toán thủ công
    PENDING_THIRD_PARTY = 'pending_third_party',   // đang xử lý ở ví/cổng bên thứ 3
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    CANCELLED = 'cancelled'
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

    @Column({ type: "decimal", precision: 10, scale: 2,nullable:true })
    total_amount!: number;

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

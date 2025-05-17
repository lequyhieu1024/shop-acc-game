import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from "typeorm";
import {Order} from "@/app/models/entities/Order";

@Entity({ name: "vouchers" })
export class Voucher {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", length: 50, unique: true })
    code!: string;

    @Column({ type: "bigint" })
    value!: number;

    @Column({ type: "datetime" })
    issue_date!: Date;

    @Column({ type: "datetime" })
    expired_date!: Date;

    @Column({ type: "enum", enum: ["private", "public"], default: "public" })
    type!: string;

    @Column({ type: "int"})
    quantity!: number;

    @Column({ type: "enum", enum: ["active",  "inactive"]})
    status!: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date

    @DeleteDateColumn()
    deleted_at?: Date;

    @OneToMany(() => Order, orders => orders.voucher, { cascade: true })
    orders: Order[] | undefined;
}

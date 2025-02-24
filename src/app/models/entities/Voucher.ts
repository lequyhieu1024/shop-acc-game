import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";

@Entity({ name: "vouchers" })
export class Voucher {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", length: 50, unique: true })
    voucher_code!: string;

    @Column({ type: "bigint" })
    value!: number;

    @Column({ type: "bigint" })
    min_order_amount!: number;

    @Column({ type: "datetime" })
    issue_date!: Date;

    @Column({ type: "datetime" })
    expired_date!: Date;

    @Column({ type: "enum", enum: ["private", "public"], default: "public" })
    type!: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date

    @DeleteDateColumn()
    deleted_at?: Date;
}

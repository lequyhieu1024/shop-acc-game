import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({ name: "user_vouchers" })
export class UserVoucher {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "bigint" })
    user_id!: number;

    @Column({ type: "bigint" })
    voucher_id!: number;
}

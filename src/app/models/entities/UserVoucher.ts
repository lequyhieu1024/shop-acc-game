import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Voucher } from "./Voucher";

@Entity({ name: "user_vouchers" })
export class UserVoucher {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(() => Voucher, (voucher) => voucher.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "voucher_id" })
    voucher!: Voucher;
}

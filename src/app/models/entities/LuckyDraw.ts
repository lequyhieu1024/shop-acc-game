import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {LuckyDrawItem} from "@/app/models/entities/LuckyDrawItem";

export enum LuckyDrawType {
    VOUCHER = "voucher",
    DIAMOND = "diamond",
    ACC_GAME = "acc_game",
    COMBINE = "combine"
}

@Entity('lucky_draws')
export class LuckyDraw {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: "enum", enum: LuckyDrawType})
    type!: LuckyDrawType

    @Column("decimal")
    amount_draw!: number;

    @Column()
    quality!: string;

    @Column({ type: "boolean"})
    accept_draw!: boolean;

    @Column({ type: "timestamp" })
    issue_date!: Date;

    @Column({ type: "timestamp" })
    expired_date!: Date;

    @Column({ type: "boolean"})
    is_no_expired!: boolean;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date

    @DeleteDateColumn()
    deleted_at?: Date;

    @OneToMany(() => LuckyDrawItem, (item) => item.luckyDraw)
    items!: LuckyDrawItem[];
}

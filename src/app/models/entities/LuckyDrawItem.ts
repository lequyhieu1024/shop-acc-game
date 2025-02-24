import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { LuckyDraw } from "./LuckyDraw";

@Entity("lucky_draw_items")
export class LuckyDrawItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => LuckyDraw, (luckyDraw) => luckyDraw.items, { onDelete: "CASCADE" })
    luckyDraw!: LuckyDraw;

    @Column()
    item_id!: number;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("lucky_draw_items")
export class LuckyDrawItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    item_id!: number;
}

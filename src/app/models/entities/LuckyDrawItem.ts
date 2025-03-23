import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("lucky_draw_items")
export class LuckyDrawItem {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    lucky_draw_id?: number;

    @Column()
    item_type?: string;

    @Column({ nullable: true })
    item_id?: number;

    @Column({ nullable: true })
    item_text?: string;

    @Column({ type: "float" })
    probability?: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at?: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at?: Date;
}
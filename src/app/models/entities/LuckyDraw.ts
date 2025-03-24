import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("lucky_draws")
export class LuckyDraw {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    type?: string;

    @Column()
    amount_draw?: number;

    @Column()
    quality?: string;

    @Column({type: "boolean", default: false})
    accept_draw?: boolean;

    @Column({type: "datetime", nullable: true})
    issue_date?: Date;

    @Column({type: "datetime", nullable: true})
    expired_date?: Date;

    @Column({type: "boolean", default: false})
    is_no_expired?: boolean;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    created_at?: Date;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updated_at?: Date;

    @Column({type: "datetime", nullable: true})
    deleted_at?: Date;
}
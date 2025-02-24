import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({ name: "user_views" })
export class UserView {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "bigint" })
    user_id!: number;

    @Column({ type: "bigint" })
    product_id!: number;
}

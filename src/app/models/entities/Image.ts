import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "images" })
export class ProductImage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 500 })
    image_url!: string;

    @Column({ type: "bigint", default: null })
    product_id!: number;
}

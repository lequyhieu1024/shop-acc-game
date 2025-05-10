import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Product} from "@/app/models/entities/Product";

@Entity({ name: "images" })
export class ProductImage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 500 })
    image_url!: string;

    @Column({ type: "bigint", default: null })
    product_id!: number;

    @ManyToOne(() => Product, { eager: false })
    @JoinColumn({ name: "product_id" })
    product: Product | undefined;
}

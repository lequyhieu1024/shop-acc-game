import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import {Product} from "@/app/models/entities/Product";

@Entity({ name: "images" })
export class Image {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 500 })
    image_url!: string;

    @ManyToOne(() => Product, (product) => product.images, { onDelete: "CASCADE" })
    product!: Product;
}

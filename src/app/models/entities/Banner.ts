import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";

@Entity({ name: "banners" })
export class Banner {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 500 })
    image_url!: string;

    @Column({ type: "boolean" })
    is_active!: boolean;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date

    @DeleteDateColumn()
    deleted_at?: Date;
}

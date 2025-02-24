import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 50, unique: true })
    user_code!: string;

    @Column({ type: "varchar", length: 15, unique: true })
    phone!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    username!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({ type: "int", default: 1 })
    number_of_free_draw!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    referral_code?: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date

    @DeleteDateColumn()
    deleted_at?: Date;
}

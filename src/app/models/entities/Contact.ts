import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity({ name: "contacts" })
export class Contact {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    fullName!: string;

    @Column({ type: "varchar", length: 255 })
    email!: string;

    @Column({ type: "text" })
    message!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone?: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

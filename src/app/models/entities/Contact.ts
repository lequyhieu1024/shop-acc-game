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

    @Column({ type: "varchar", length: 255, nullable: true  })
    email!: string;

    @Column({ type: "text" })
    message!: string;

    @Column({ type: "varchar", length: 20})
    phone?: string;

    @Column({ type: "boolean" })
    is_feedback!: boolean;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

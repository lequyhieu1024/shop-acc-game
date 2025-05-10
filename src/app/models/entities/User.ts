import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from "typeorm";
import {CardTransaction} from "@/app/models/entities/CardTransaction";

enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

@Entity({name: "users"})
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 50, unique: true})
    user_code!: string;

    @Column({type: "bigint", default: 0})
    balance!: number;

    @Column({type: "varchar", length: 15, nullable: true})
    phone!: string;

    @Column({type: "varchar", length: 100, unique: true})
    username!: string;

    @Column({type: "varchar", length: 255})
    password!: string;

    @Column({type: "int", default: 1})
    number_of_free_draw!: number;

    @Column({type: "varchar", length: 50, nullable: true})
    referral_code?: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    @CreateDateColumn({type: "timestamp"})
    created_at!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updated_at!: Date

    @DeleteDateColumn()
    deleted_at?: Date;

    @OneToMany(() => CardTransaction, cardTransaction => cardTransaction.user, { cascade: true }) // Trì hoãn import và thêm cascade
    cardTransactions: CardTransaction[] | undefined;
}

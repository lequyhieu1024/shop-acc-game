import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum CardStatus {
    SUCCESS_CORRECT = 1,
    SUCCESS_INCORRECT = 2,
    FAILED = 3,
    MAINTENANCE = 4,
    PENDING = 99,
    SUBMIT_FAILED = 100
}

@Entity('card_transactions')
export class CardTransaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'bigint', nullable: false })
    user_id!: number;

    @Column({
        type: 'enum',
        enum: CardStatus,
        default: CardStatus.PENDING
    })
    status!: CardStatus;

    @Column({ type: 'varchar', length: 255, nullable: false })
    message!: string;

    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    request_id!: string;

    @Column({ type: 'int', nullable: false })
    declared_value!: number;

    @Column({ type: 'int', nullable: false })
    value!: number;

    @Column({ type: 'int', nullable: false })
    amount!: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    code!: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    serial!: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    telco!: string;

    @Column({ type: 'int', unique: true, nullable: false })
    trans_id!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    callback_sign!: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    command!: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;
}

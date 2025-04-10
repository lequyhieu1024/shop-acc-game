import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity({ name: "notification_banners" })
export class NotificationBanner {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "text", nullable: true })
    content?: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    image_url?: string; // ← thêm trường ảnh

    @Column({ type: "boolean", default: true })
    is_active!: boolean;

    @Column({ type: "timestamp", nullable: true })
    start_time?: string;

    @Column({ type: "timestamp", nullable: true })
    end_time?: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

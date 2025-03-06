import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";

export enum SystemStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}
@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, unique: true })
  code!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 500 })
  thumbnail!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  account_id?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  account_name?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "bigint" })
  regular_price!: number;

  @Column({ type: "bigint" })
  sale_price!: number;

  @Column({ type: "varchar", length: 255 })
  skin_type!: string;

  @Column({ type: "boolean" })
  is_infinity_card!: boolean;

  @Column({ type: "varchar", length: 255 })
  register_by!: string;

  @Column({ type: "varchar", length: 255 })
  rank!: string;

  @Column({ type: "varchar", length: 255 })
  server!: string;

  @Column({ type: "int", nullable: true })
  number_diamond_available?: number;

  @Column({ type: "enum", enum: SystemStatus, default: SystemStatus.ACTIVE })
  status!: SystemStatus;

  @Column({ type: "boolean", default: true })
  is_for_sale!: boolean;

  @Column({ type: "bigint" })
  category_id!: number;

  @Column({ type: "int" })
  quantity!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

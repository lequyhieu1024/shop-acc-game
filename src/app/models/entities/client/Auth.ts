import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";

@Entity({ name: "auths" })
export class Auth {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 100 })
  password!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  full_name?: string;

  @Column({ nullable: true }) // Make sure refreshToken is optional
  refreshToken?: string;

  @Column({ nullable: true }) // For role, if applicable
  role?: string;
  
  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

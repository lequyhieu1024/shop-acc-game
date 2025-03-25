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

  @Column({ type: "varchar", length: 15, unique: true, nullable: true })
  phone_number?: string;

  @Column({ type: "varchar", nullable: true }) 
  avatar?: string;

  @Column({ type: "enum", enum: ["male", "female", "other"], nullable: true })
  gender?: "male" | "female" | "other";

  @Column({ type: "date", nullable: true })
  dob?: Date;

  @Column({ nullable: true }) 
  refreshToken?: string;

  @Column({ nullable: true }) 
  role?: string;
  
  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  @Column({ type: "varchar", length: 50, nullable: true })
  provider?: string; // google, facebook, etc.

  @Column({ type: "timestamp", nullable: true })
  last_login?: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

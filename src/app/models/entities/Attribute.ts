import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('attributes')
export class Attribute {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @CreateDateColumn({type: "timestamp"})
    created_at!: Date

    @CreateDateColumn({type: "timestamp"})
    updated_at!: Date
}
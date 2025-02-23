import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity('attribute_values')
export class Attribute {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Attribute, (attribute) => (attribute.id))
    @JoinColumn({ name: 'attribute_id' })
    attribute_id!: number

    @Column()
    value! : string

    @CreateDateColumn({type: "timestamp"})
    created_at!: Date

    @CreateDateColumn({type: "timestamp"})
    updated_at!: Date
}
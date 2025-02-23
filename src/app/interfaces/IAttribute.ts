import {Timestamp} from "typeorm";

export interface IAttribute {
    id: number,
    name: string,
    created_at: Timestamp,
    updated_at: Timestamp
}
import {Timestamp} from "typeorm";

export interface ICategory {
    id: number;
    name: string;
    image: string;
    created_at: Timestamp;
    updated_at: Timestamp;
}
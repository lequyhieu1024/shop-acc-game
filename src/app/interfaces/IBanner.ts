import {Timestamp} from "typeorm";

export interface IBanner {
    id: number;
    is_active: boolean;
    image_url: string;
    created_at: Timestamp;
    updated_at: Timestamp;
}
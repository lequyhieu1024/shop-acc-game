import {Timestamp} from "typeorm";

export interface IContact {
    id: number;
    fullName: string;
    phone: string;
    message:string;
    email?:string;
    is_feedback:boolean;
    created_at: Timestamp;
    updated_at: Timestamp;
}
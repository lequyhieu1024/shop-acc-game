import {Timestamp} from "typeorm";

export interface IUser {
    id: number;
    user_code: string;
    phone: string;
    username: string;
    password: string;
    number_of_free_draw: number;
    referral_code?: string | null;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at?: Timestamp | null;
    balance: bigint;
}

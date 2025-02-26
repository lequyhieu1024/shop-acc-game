import {Timestamp} from "typeorm";
import {DateTime} from "next-auth/providers/kakao";

export interface IVoucher {
    id: number;
    name: string;
    code: string;
    value: number;
    issue_date: DateTime;
    expired_date: DateTime;
    type: 'private' | 'public';
    quantity: number,
    status: 'active' | 'inactive'
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}
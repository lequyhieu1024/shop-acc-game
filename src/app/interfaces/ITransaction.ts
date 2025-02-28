import {Timestamp} from "typeorm";

export interface ITransaction {
    id: number;
    user_id: number;
    status: "1" | "2" | "3" | "4" | "99" | "100";
    message: string;
    request_id: number;
    declared_value?: number | null;
    value?: number | null;
    amount: number;
    code: string;
    serial: string;
    telco: string;
    trans_id?: number | null;
    callback_sign?: string | null;
    command: string;
    created_at: Timestamp;
}

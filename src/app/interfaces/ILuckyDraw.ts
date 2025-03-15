export interface ILuckyDraw {
    id: number;
    name: string;
    type: string;
    amount_draw: number;
    quality: string;
    accept_draw: boolean | string | number;
    issue_date: string | Date | null;
    expired_date: string | Date | null;
    is_no_expired: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}
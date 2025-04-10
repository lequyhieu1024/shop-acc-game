export interface INotificationBanner {
    id: number;
    title: string;
    content?: string;
    image_url?: string;
    is_active: boolean;
    start_time?: string; // ISO date string
    end_time?: string;   // ISO date string
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

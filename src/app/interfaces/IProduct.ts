export interface IProduct {
    id: number;
    code: string;
    name: string;
    thumbnail: string;
    account_id?: string | null;
    account_name?: string | null;
    description?: string | null;
    regular_price: number;
    sale_price: number;
    skin_type: string;
    is_infinity_card: boolean;
    register_by: string;
    rank: string;
    server: string;
    number_diamond_available?: number | null;
    status: 'active' | 'inactive';
    is_for_sale: boolean;
    category_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface SalesFilter {
    start_date?: string;
    end_date?: string;
    client_id?: number;
    product_id?: number;
    min_total_price?: number;
    max_total_price?: number;
}

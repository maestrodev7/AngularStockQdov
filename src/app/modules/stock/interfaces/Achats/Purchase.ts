export interface Purchase {
    id: number;
    supplier_id: number;
    product_id: number;
    quantity: number;
    price: number;
    total_price: number;
    created_at: string;
    updated_at: string;
  }

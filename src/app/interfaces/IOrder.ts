import { OrderStatus, PaymentMethod, PaymentStatus } from "../models/entities/Order";
import { IProduct } from "./IProduct";
import {Voucher} from "@/app/models/entities/Voucher";

export interface IOrder {
  id: number;
  user_id: number;
  customer_id?:string
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_items?: IOrderItem[]
  items?: IOrderItem[]
  created_at?: Date,
  voucher: Voucher | undefined;
  total_product_price?: number | null,
  voucher_discount?: number | null,
}
export interface IOrderItem {
  key?: string;
  product_id: number;       // ID of the product
  product_name?: string;    // Name of the product (optional, for display purposes)
  quantity: number;         // Quantity of the product
  unit_price: number;       // Unit price of the product
  line_total: number;       // Total price for this line item (quantity * unit_price)
  product?:IProduct

}
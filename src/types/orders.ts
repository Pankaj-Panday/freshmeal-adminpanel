import { Address } from "./address";
import { Product } from "./product";
import { User } from "./users";

export type Order = {
  id: string;
  items: {
    name: string;
    price: number;
    productId: string;
    quantity: number;
  }[];
  totalAmount: number;
  status: string;
  address: Address;
  createdAt: string;
  paymentMethod: string;
  paymentId?: string | null;
  razorpayOrderId?: string | null;
  userId: string;
  user?: User | null;
};

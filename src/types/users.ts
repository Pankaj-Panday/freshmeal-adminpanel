import { Order } from "./orders";

export type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  orders: Order[];
  addresses: any[];
};

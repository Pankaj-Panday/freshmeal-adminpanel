import { Category } from "./category";
import { Order } from "./orders";
import { Product } from "./product";
import { User } from "./users";

export type PaginatedApiResponse<T> = {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type FetchProductsApiResponse = PaginatedApiResponse<Product>;
export type FetchCategoriesApiResponse = PaginatedApiResponse<Category>;
export type FetchUsersApiResponse = PaginatedApiResponse<User>;
export type FetchOrdersApiResponse = PaginatedApiResponse<Order>;

export type FetchOrderByIdApiResponse = {
  success: boolean;
  data: Order;
};

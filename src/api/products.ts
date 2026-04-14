import { Product } from "../types/product";
import { api } from "./axios";
import { ENDPOINTS } from "./endpoints";
import { PaginationParams } from "../types/common";

type CreateProduct = Omit<Product, "id" | "createdAt">;

export const createProduct = async (data: CreateProduct) => {
  const res = await api.post(ENDPOINTS.PRODUCTS, data);
  return res.data;
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  const res = await api.put(`${ENDPOINTS.PRODUCTS}/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
  return res.data;
};

export const fetchProductById = async (id: string) => {
  const res = await api.get(`${ENDPOINTS.PRODUCTS}/${id}`);
  return res.data;
};

export const fetchProducts = async (params?: PaginationParams) => {
  const res = await api.get(`${ENDPOINTS.PRODUCTS}`, { params });
  return res.data;
};

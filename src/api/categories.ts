import { FetchProductsApiResponse } from "../types/apiResponse";
import { PaginationParams } from "../types/common";
import { api } from "./axios";
import { ENDPOINTS } from "./endpoints";

export const fetchCategories = async (params?: PaginationParams) => {
  const res = await api.get(ENDPOINTS.CATEGORIES, { params });
  return res.data;
};

export const fetchCategoryById = async (id: string) => {
  const res = await api.get(`${ENDPOINTS.CATEGORIES}/${id}`);
  return res.data;
};

export const fetchProductsByCategory = async (
  id: string,
  params?: PaginationParams,
): Promise<FetchProductsApiResponse> => {
  const res = await api.get(`${ENDPOINTS.CATEGORIES}/${id}/products`, {
    params,
  });
  return res.data;
};

export const createCategory = async (data: {
  name: string;
  imageUrl?: string;
}) => {
  const res = await api.post(ENDPOINTS.CATEGORIES, data);
  return res.data;
};

export const updateCategory = async (
  id: string,
  data: {
    name: string;
    imageUrl?: string;
  },
) => {
  const res = await api.put(`${ENDPOINTS.CATEGORIES}/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`${ENDPOINTS.CATEGORIES}/${id}`);
  return res.data;
};

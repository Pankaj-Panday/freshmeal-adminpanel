import { api } from "./axios";
import { ENDPOINTS } from "./endpoints";
import {
  FetchOrderByIdApiResponse,
  FetchOrdersApiResponse,
} from "../types/apiResponse";

export const fetchOrders = async (): Promise<FetchOrdersApiResponse> => {
  const res = await api.get(ENDPOINTS.ORDERS);
  return res.data;
};

export const fetchOrderById = async (
  orderId: string,
): Promise<FetchOrderByIdApiResponse> => {
  const res = await api.get(`${ENDPOINTS.ORDERS}/${orderId}`);
  return res.data;
};

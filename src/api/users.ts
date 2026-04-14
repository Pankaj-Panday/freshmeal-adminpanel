import { api } from "./axios";
import { ENDPOINTS } from "./endpoints";

export const fetchUsers = async () => {
  const res = await api.get(ENDPOINTS.USERS);
  return res.data;
};

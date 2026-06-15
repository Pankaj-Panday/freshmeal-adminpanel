import axios from "axios";

const API_BASE_URL = "https://mealapp-backend-rvy4.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

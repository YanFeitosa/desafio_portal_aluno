import axios from "axios";
import type { AxiosError } from "axios";
import {
  getAuthToken,
  notifySessionExpired,
  removeAuthToken,
} from "./storage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";
    const isLoginRequest = requestUrl.endsWith("/auth/login");

    if (status === 401 && !isLoginRequest && getAuthToken()) {
      removeAuthToken();
      notifySessionExpired();
    }

    return Promise.reject(error);
  }
);

import { api } from "../../../lib/api";
import type { LoginRequest, LoginResponse, User } from "../types";

export async function login(data: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}

export async function getAuthenticatedUser() {
  const response = await api.get<User>("/auth/me");
  return response.data;
}
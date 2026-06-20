import type { UserRole } from "../../types/role";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  studentId: number | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
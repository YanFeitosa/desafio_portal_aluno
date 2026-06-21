import type { UserRole } from "../../types/role";

export type UserIdentity = {
  id: number;
  name: string;
  email: string;
};

export type UserSummary = UserIdentity & {
  role: UserRole;
};

export type AuthenticatedUser = UserSummary & {
  studentId: number | null;
};

export type User = AuthenticatedUser;

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: UserSummary;
};
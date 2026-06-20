import { createContext } from "react";
import type { LoginRequest, User } from "./types";

export type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<User>;
  logout: () => void;
};

export const AuthContext = createContext({} as AuthContextData);

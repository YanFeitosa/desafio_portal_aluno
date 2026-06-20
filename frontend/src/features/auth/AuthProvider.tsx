import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "./AuthContext";
import { getAuthenticatedUser, login as loginRequest } from "./services/authService";
import type { LoginRequest, User } from "./types";
import {
  getAuthToken,
  removeAuthToken,
  saveAuthToken,
} from "../../lib/storage";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(data: LoginRequest) {
    const response = await loginRequest(data);

    saveAuthToken(response.token);
    setUser(response.user);

    return response.user;
  }

  function logout() {
    removeAuthToken();
    setUser(null);
  }

  useEffect(() => {
    async function loadAuthenticatedUser() {
      const token = getAuthToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const authenticatedUser = await getAuthenticatedUser();
        setUser(authenticatedUser);
      } catch {
        removeAuthToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthenticatedUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

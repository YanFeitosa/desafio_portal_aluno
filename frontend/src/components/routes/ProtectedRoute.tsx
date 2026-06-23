import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { LoadingState } from "../ui";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState fullPage message="Carregando sessão..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

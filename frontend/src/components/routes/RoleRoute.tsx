import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import type { UserRole } from "../../types/role";
import { LoadingState } from "../ui";

type RoleRouteProps = {
  allowedRoles: UserRole[];
};

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState fullPage message="Validando acesso..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

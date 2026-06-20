import { createBrowserRouter, Navigate } from "react-router-dom";

import { ProtectedRoute } from "../components/routes/ProtectedRoute";
import { RoleRoute } from "../components/routes/RoleRoute";
import { AppLayout } from "../components/layout/AppLayout";

import { LoginPage } from "../features/auth/pages/LoginPage";
import { CoordinatorHome } from "../features/coordinator/pages/CoordinatorHome";
import { StudentHome } from "../features/student/pages/StudentHome";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: <RoleRoute allowedRoles={["COORDINATOR"]} />,
            children: [
              {
                path: "/coordinator",
                element: <CoordinatorHome />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["STUDENT"]} />,
            children: [
              {
                path: "/student",
                element: <StudentHome />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
]);
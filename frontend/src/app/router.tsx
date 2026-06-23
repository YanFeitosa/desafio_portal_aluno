import { createBrowserRouter, Navigate } from "react-router-dom";

import { ProtectedRoute } from "../components/routes/ProtectedRoute";
import { RoleRoute } from "../components/routes/RoleRoute";
import { AppLayout } from "../components/layout/AppLayout";

import { LoginPage } from "../features/auth/pages/LoginPage";

import { CoordinatorHome } from "../features/coordinator/pages/CoordinatorHome";
import { AcademicManagementPage } from "../features/coordinator/pages/AcademicManagementPage";
import { ManageNoticesPage } from "../features/coordinator/pages/ManageNoticesPage";
import { StudentAcademicPage } from "../features/coordinator/pages/StudentAcademicPage";

import { StudentHome } from "../features/student/pages/StudentHome";
import { StudentNoticesPage } from "../features/student/pages/StudentNoticesPage";
import { StudentReportCardPage } from "../features/student/pages/StudentReportCardPage";

import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { AppErrorPage } from "../pages/AppErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <AppErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
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
                    path: "coordinator",
                    element: <CoordinatorHome />,
                  },
                  {
                    path: "coordinator/notices",
                    element: <ManageNoticesPage />,
                  },
                  {
                    path: "coordinator/grades",
                    element: <AcademicManagementPage />,
                  },
                  {
                    path: "coordinator/grades/:id",
                    element: <StudentAcademicPage />,
                  },
                ],
              },
              {
                element: <RoleRoute allowedRoles={["STUDENT"]} />,
                children: [
                  {
                    path: "student",
                    element: <StudentHome />,
                  },
                  {
                    path: "student/notices",
                    element: <StudentNoticesPage />,
                  },
                  {
                    path: "student/report-card",
                    element: <StudentReportCardPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },
]);

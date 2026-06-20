import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { noticeRoutes } from "./notice.routes";
import { studentRoutes } from "./student.routes";
import { subjectRoutes } from "./subject.routes";
import { gradeRoutes } from "./grade.routes";
import { reportCardRoutes } from "./reportCard.routes";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/notices", noticeRoutes);
routes.use("/students", studentRoutes);
routes.use("/subjects", subjectRoutes);
routes.use("/grades", gradeRoutes);
routes.use("/report-card", reportCardRoutes);
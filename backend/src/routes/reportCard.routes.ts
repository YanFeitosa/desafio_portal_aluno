import { Router } from "express";
import { ReportCardController } from "../controllers/ReportCardController";
import { asyncHandler } from "../utils/asyncHandler";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { idParamSchema } from "../validators/common.validator";

export const reportCardRoutes = Router();

const reportCardController = new ReportCardController();

reportCardRoutes.get(
  "/me",
  ...auth.onlyStudent,
  asyncHandler(reportCardController.showMyReportCard)
);

reportCardRoutes.get(
  "/students/:id",
  ...auth.onlyCoordinator,
  validateRequest({
    params: idParamSchema,
  }),
  asyncHandler(reportCardController.showStudentReportCard)
);
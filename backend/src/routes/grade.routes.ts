import { Router } from "express";
import { GradeController } from "../controllers/GradeController";
import { asyncHandler } from "../utils/asyncHandler";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { idParamSchema } from "../validators/common.validator";
import {
  createGradeSchema,
  updateGradeSchema,
} from "../validators/grade.validator";

export const gradeRoutes = Router();

const gradeController = new GradeController();

gradeRoutes.post(
  "/",
  ...auth.onlyCoordinator,
  validateRequest({
    body: createGradeSchema,
  }),
  asyncHandler(gradeController.create)
);

gradeRoutes.put(
  "/:id",
  ...auth.onlyCoordinator,
  validateRequest({
    params: idParamSchema,
    body: updateGradeSchema,
  }),
  asyncHandler(gradeController.update)
);
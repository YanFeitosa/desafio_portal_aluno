import { Router } from "express";
import { StudentController } from "../controllers/StudentController";
import { asyncHandler } from "../utils/asyncHandler";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { idParamSchema } from "../validators/common.validator";

export const studentRoutes = Router();

const studentController = new StudentController();

studentRoutes.get(
  "/",
  ...auth.onlyCoordinator,
  asyncHandler(studentController.index)
);

studentRoutes.get(
  "/:id",
  ...auth.onlyCoordinator,
  validateRequest({
    params: idParamSchema,
  }),
  asyncHandler(studentController.show)
);

studentRoutes.get(
  "/:id/enrollments",
  ...auth.onlyCoordinator,
  validateRequest({
    params: idParamSchema,
  }),
  asyncHandler(studentController.enrollments)
);
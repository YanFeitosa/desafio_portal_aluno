import { Router } from "express";
import { SubjectController } from "../controllers/SubjectController";
import { asyncHandler } from "../utils/asyncHandler";
import { auth } from "../middlewares/auth";

export const subjectRoutes = Router();

const subjectController = new SubjectController();

subjectRoutes.get(
  "/",
  ...auth.onlyCoordinator,
  asyncHandler(subjectController.index)
);
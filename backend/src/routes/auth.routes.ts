import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../utils/asyncHandler";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema } from "../validators/auth.validator";

export const authRoutes = Router();

const authController = new AuthController();

authRoutes.post(
  "/login",
  validateRequest({ body: loginSchema }),
  asyncHandler(authController.login)
);

authRoutes.get("/me", ...auth.authenticated, (req, res) => {
  return res.json({
    user: req.user,
  });
});
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../utils/asyncHandler";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema } from "../validators/auth.validator";

export const authRoutes = Router();

const authController = new AuthController();

const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas tentativas de login. Tente novamente mais tarde.",
  },
});

authRoutes.post(
  "/login",
  loginRateLimiter,
  validateRequest({
    body: loginSchema,
  }),
  asyncHandler(authController.login)
);

authRoutes.get("/me", ...auth.authenticated, (req, res) => {
  return res.json({
    user: req.user,
  });
});
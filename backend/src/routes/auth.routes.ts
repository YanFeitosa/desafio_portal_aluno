import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../utils/asyncHandler";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema } from "../validators/auth.validator";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

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

authRoutes.get(
  "/me",
  ...auth.authenticated,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: req.user!.studentId ?? null,
    });
  })
);
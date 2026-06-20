import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { AppError } from "../errors/AppError";

export function requireRole(...roles: UserRole[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Acesso não autorizado.", 403);
    }

    return next();
  };
}
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

interface TokenPayload {
  sub: string;
  role: UserRole;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não informado.", 401);
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      throw new AppError("Token inválido.", 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(decoded.sub),
      },
      select: {
        id: true,
        role: true,
        deletedAt: true,
        student: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user || user.deletedAt) {
      throw new AppError("Usuário não encontrado.", 401);
    }

    req.user = {
      id: user.id,
      role: user.role,
      studentId: user.student?.id ?? null,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
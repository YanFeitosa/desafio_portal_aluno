import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

interface LoginRequest {
  email: string;
  password: string;
}

export class AuthService {
  async login({ email, password }: LoginRequest) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || user.deletedAt) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
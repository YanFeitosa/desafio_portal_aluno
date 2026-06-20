import { RequestHandler } from "express";
import { UserRole } from "@prisma/client";
import { authMiddleware } from "./authMiddleware";
import { requireRole } from "./roleMiddleware";

function requireAuth(...roles: UserRole[]): RequestHandler[] {
  if (roles.length === 0) {
    return [authMiddleware];
  }

  return [authMiddleware, requireRole(...roles)];
}

export const auth = {
  authenticated: requireAuth(),
  onlyCoordinator: requireAuth(UserRole.COORDINATOR),
  onlyStudent: requireAuth(UserRole.STUDENT),
  requireAuth,
};
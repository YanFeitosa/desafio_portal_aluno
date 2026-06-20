import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const authService = new AuthService();

    const result = await authService.login({
      email,
      password,
    });

    return res.json(result);
  };
}
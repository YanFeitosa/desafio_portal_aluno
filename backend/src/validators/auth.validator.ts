import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ error: "Informe um e-mail válido." })
    .trim()
    .toLowerCase(),

  password: z
    .string({ error: "Senha é obrigatória." })
    .min(1, "Senha é obrigatória."),
});
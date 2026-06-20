import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({quiet: true});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(3333),

  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória."),

  JWT_SECRET: z
    .string()
    .min(16, "JWT_SECRET deve ter pelo menos 16 caracteres."),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Erro nas variáveis de ambiente:");
  console.error(parsedEnv.error.format());

  throw new Error("Variáveis de ambiente inválidas.");
}

export const env = parsedEnv.data;
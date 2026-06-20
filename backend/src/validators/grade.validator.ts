import { z } from "zod";

export const createGradeSchema = z.object({
  enrollmentId: z.coerce
    .number({ error: "Matrícula é obrigatória." })
    .int("Matrícula deve ser um número inteiro.")
    .positive("Matrícula deve ser um número válido."),

  evaluationName: z
    .string({ error: "Nome da avaliação é obrigatório." })
    .trim()
    .min(2, "Nome da avaliação deve ter pelo menos 2 caracteres."),

  score: z.coerce
    .number({ error: "Nota é obrigatória." })
    .min(0, "Nota não pode ser menor que 0.")
    .max(10, "Nota não pode ser maior que 10."),
});

export const updateGradeSchema = z
  .object({
    evaluationName: z
      .string({ error: "Nome da avaliação deve ser um texto." })
      .trim()
      .min(2, "Nome da avaliação deve ter pelo menos 2 caracteres.")
      .optional(),

    score: z.coerce
      .number({ error: "Nota deve ser um número." })
      .min(0, "Nota não pode ser menor que 0.")
      .max(10, "Nota não pode ser maior que 10.")
      .optional(),
  })
  .refine(
    (data) => data.evaluationName !== undefined || data.score !== undefined,
    {
      message: "Informe ao menos um campo para atualizar.",
    }
  );
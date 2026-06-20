import { z } from "zod";

function parseScore(value: unknown) {
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
      return value;
    }

    const numberValue = Number(trimmedValue);

    if (Number.isNaN(numberValue)) {
      return value;
    }

    return numberValue;
  }

  return value;
}

const evaluationNameSchema = z
  .string({ error: "Nome da avaliação é obrigatório." })
  .trim()
  .min(2, "Nome da avaliação deve ter pelo menos 2 caracteres.")
  .max(191, "Nome da avaliação deve ter no máximo 191 caracteres.");

const scoreSchema = z.preprocess(
  parseScore,
  z
    .number({ error: "Nota deve ser um número." })
    .min(0, "Nota não pode ser menor que 0.")
    .max(10, "Nota não pode ser maior que 10.")
);

export const createGradeSchema = z.object({
  enrollmentId: z.coerce
    .number({ error: "Matrícula é obrigatória." })
    .int("Matrícula deve ser um número inteiro.")
    .positive("Matrícula deve ser um número válido."),

  evaluationName: evaluationNameSchema,

  score: scoreSchema,
});

export const updateGradeSchema = z
  .object({
    evaluationName: evaluationNameSchema.optional(),
    score: scoreSchema.optional(),
  })
  .refine(
    (data) => data.evaluationName !== undefined || data.score !== undefined,
    {
      message: "Informe ao menos um campo para atualizar.",
    }
  );
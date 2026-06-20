import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z
    .string({ error: "Título é obrigatório." })
    .trim()
    .min(3, "Título deve ter pelo menos 3 caracteres."),

  content: z
    .string({ error: "Conteúdo é obrigatório." })
    .trim()
    .min(5, "Conteúdo deve ter pelo menos 5 caracteres."),
});

export const updateNoticeSchema = z
  .object({
    title: z
      .string({ error: "Título não deve estar vazio." })
      .trim()
      .min(3, "Título deve ter pelo menos 3 caracteres.")
      .optional(),

    content: z
      .string({ error: "Conteúdo não deve estar vazio." })
      .trim()
      .min(5, "Conteúdo deve ter pelo menos 5 caracteres.")
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "Informe ao menos um campo para atualizar.",
  });
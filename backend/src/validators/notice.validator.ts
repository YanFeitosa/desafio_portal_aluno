import { z } from "zod";

const noticeTitleSchema = z
  .string({ error: "Título é obrigatório." })
  .trim()
  .min(3, "Título deve ter pelo menos 3 caracteres.")
  .max(191, "Título deve ter no máximo 191 caracteres.");

const noticeContentSchema = z
  .string({ error: "Conteúdo é obrigatório." })
  .trim()
  .min(5, "Conteúdo deve ter pelo menos 5 caracteres.");

export const createNoticeSchema = z.object({
  title: noticeTitleSchema,
  content: noticeContentSchema,
});

export const updateNoticeSchema = z
  .object({
    title: noticeTitleSchema.optional(),
    content: noticeContentSchema.optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "Informe ao menos um campo para atualizar.",
  });
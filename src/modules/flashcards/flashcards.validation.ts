
import { z } from "zod";

export const createFlashcardSchema = z.object({
  front: z
    .string()
    .trim()
    .min(1, "Flashcard question is required")
    .max(1000),

  back: z
    .string()
    .trim()
    .min(1, "Flashcard answer is required")
    .max(10000),

  noteId: z.string().trim().min(1).optional().nullable(),
  materialId: z.string().trim().min(1).optional().nullable(),
});

export const updateFlashcardSchema = z
  .object({
    front: z.string().trim().min(1).max(1000).optional(),
    back: z.string().trim().min(1).max(10000).optional(),
    noteId: z.string().trim().min(1).nullable().optional(),
    materialId: z.string().trim().min(1).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type CreateFlashcardInput = z.infer<
  typeof createFlashcardSchema
>;

export type UpdateFlashcardInput = z.infer<
  typeof updateFlashcardSchema
>;

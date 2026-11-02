import { z } from "zod";

export const askQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(2000, "Question cannot exceed 2000 characters"),

  materialId: z
    .string()
    .trim()
    .min(1, "Material ID is required"),

  conversationId: z
    .string()
    .trim()
    .min(1)
    .optional(),
});

export type AskQuestionInput = z.infer<typeof askQuestionSchema>;
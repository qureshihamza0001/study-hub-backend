import { z } from "zod";

export const summarizeTextSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Text is required")
    .max(50000, "Text cannot exceed 50000 characters"),

  length: z
    .enum(["short", "medium", "detailed"])
    .default("medium"),
});

export const summarizeNoteSchema = z.object({
  noteId: z.string().trim().min(1, "Note ID is required"),

  length: z
    .enum(["short", "medium", "detailed"])
    .default("medium"),
});

export const summarizeMaterialSchema = z.object({
  materialId: z.string().trim().min(1, "Material ID is required"),

  length: z
    .enum(["short", "medium", "detailed"])
    .default("medium"),
});

export type SummarizeTextInput = z.infer<typeof summarizeTextSchema>;
export type SummarizeNoteInput = z.infer<typeof summarizeNoteSchema>;
export type SummarizeMaterialInput = z.infer<typeof summarizeMaterialSchema>;
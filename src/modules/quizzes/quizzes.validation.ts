
import { z } from "zod";

const questionSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(1000),
  options: z.array(z.string().trim().min(1)).min(2).max(6),
  correctAnswer: z.string().trim().min(1, "Correct answer is required"),
  explanation: z.string().max(2000).optional(),
});

export const createQuizSchema = z.object({
  title: z.string().trim().min(1, "Quiz title is required").max(200),
  questions: z.array(questionSchema).min(1, "At least one question is required").max(100),
  materialId: z.string().trim().min(1).optional().nullable(),
}).superRefine((quiz, ctx) => {
  quiz.questions.forEach((question, index) => {
    if (!question.options.includes(question.correctAnswer)) {
      ctx.addIssue({
        code: "custom",
        path: ["questions", index, "correctAnswer"],
        message: "Correct answer must match one of the options",
      });
    }
  });
});

export const updateQuizSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  questions: z.array(questionSchema).min(1).max(100).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Provide at least one field to update" }
).superRefine((quiz, ctx) => {
  quiz.questions?.forEach((question, index) => {
    if (!question.options.includes(question.correctAnswer)) {
      ctx.addIssue({
        code: "custom",
        path: ["questions", index, "correctAnswer"],
        message: "Correct answer must match one of the options",
      });
    }
  });
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;

import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { askQuestionSchema } from "./study-assistant.validation.js";
import { askQuestion } from "./study-assistant.service.js";

export async function askQuestionController(
  req: Request,
  res: Response
) {
  try {
    const validation = askQuestionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid question data",
        errors: validation.error.flatten(),
      });
    }

    const userId = (req as AuthRequest).userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const result = await askQuestion(userId, validation.data);

    return res.status(200).json({
      message: "Question answered successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    if (message === "Study material not found") {
      return res.status(404).json({ message });
    }

    if (message === "No extracted text available for this material") {
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message });
  }
}
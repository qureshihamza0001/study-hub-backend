import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

import {
  summarizeTextSchema,
  summarizeNoteSchema,
  summarizeMaterialSchema,
} from "./ai-summarizer.validation.js";

import {
  summarizeText,
  summarizeNote,
  summarizeMaterial,
} from "./ai-summarizer.service.js";

export async function summarizeTextController(req: Request, res: Response) {
  const result = summarizeTextSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }

  try {
    const summary = await summarizeText(result.data);

    return res.status(200).json({
      message: "Text summarized successfully",
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to summarize text",
    });
  }
}

export async function summarizeNoteController(req: Request, res: Response) {
  const result = summarizeNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = (req as AuthRequest).userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const summary = await summarizeNote(userId, result.data);

    return res.status(200).json({
      message: "Note summarized successfully",
      data: summary,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Note not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Failed to summarize note",
    });
  }
}

export async function summarizeMaterialController(req: Request, res: Response) {
  const result = summarizeMaterialSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = (req as AuthRequest).userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const summary = await summarizeMaterial(userId, result.data);

    return res.status(200).json({
      message: "Study material summarized successfully",
      data: summary,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Study material not found" ||
        error.message === "No extracted text available for this material")
    ) {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Failed to summarize study material",
    });
  }
}
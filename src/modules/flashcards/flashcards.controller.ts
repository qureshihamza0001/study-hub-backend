
import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import {
  createFlashcardSchema,
  updateFlashcardSchema,
} from "./flashcards.validation.js";
import * as flashcardsService from "./flashcards.service.js";

// Create a flashcard
export async function createFlashcard(
  req: Request,
  res: Response
) {
  const userId = (req as AuthRequest).userId;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const parsed = createFlashcardSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid flashcard data",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const flashcard = await flashcardsService.createFlashcard(
      userId,
      parsed.data
    );

    return res.status(201).json({
      message: "Flashcard created successfully",
      flashcard,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      ["Note not found", "Study material not found"].includes(
        error.message
      )
    ) {
      return res.status(404).json({ message: error.message });
    }

    console.error("Create flashcard error:", error);

    return res.status(500).json({
      message: "Failed to create flashcard",
    });
  }
}

// Get all flashcards
export async function getFlashcards(
  req: Request,
  res: Response
) {
  const userId = (req as AuthRequest).userId;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const flashcards = await flashcardsService.getFlashcards(userId);

    return res.status(200).json({ flashcards });
  } catch (error) {
    console.error("Get flashcards error:", error);

    return res.status(500).json({
      message: "Failed to fetch flashcards",
    });
  }
}

// Get one flashcard
export async function getFlashcardById(
  req: Request,
  res: Response
) {
  const userId = (req as AuthRequest).userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid flashcard ID" });
  }

  try {
    const flashcard = await flashcardsService.getFlashcardById(
      userId,
      id
    );

    if (!flashcard) {
      return res.status(404).json({
        message: "Flashcard not found",
      });
    }

    return res.status(200).json({ flashcard });
  } catch (error) {
    console.error("Get flashcard error:", error);

    return res.status(500).json({
      message: "Failed to fetch flashcard",
    });
  }
}

// Update a flashcard
export async function updateFlashcard(
  req: Request,
  res: Response
) {
  const userId = (req as AuthRequest).userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid flashcard ID" });
  }

  const parsed = updateFlashcardSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid flashcard data",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const flashcard = await flashcardsService.updateFlashcard(
      userId,
      id,
      parsed.data
    );

    if (!flashcard) {
      return res.status(404).json({
        message: "Flashcard not found",
      });
    }

    return res.status(200).json({
      message: "Flashcard updated successfully",
      flashcard,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      ["Note not found", "Study material not found"].includes(
        error.message
      )
    ) {
      return res.status(404).json({ message: error.message });
    }

    console.error("Update flashcard error:", error);

    return res.status(500).json({
      message: "Failed to update flashcard",
    });
  }
}

// Delete a flashcard
export async function deleteFlashcard(
  req: Request,
  res: Response
) {
  const userId = (req as AuthRequest).userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid flashcard ID" });
  }

  try {
    const result = await flashcardsService.deleteFlashcard(
      userId,
      id
    );

    if (result.count === 0) {
      return res.status(404).json({
        message: "Flashcard not found",
      });
    }

    return res.status(200).json({
      message: "Flashcard deleted successfully",
    });
  } catch (error) {
    console.error("Delete flashcard error:", error);

    return res.status(500).json({
      message: "Failed to delete flashcard",
    });
  }
}

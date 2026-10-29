
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createFlashcard,
  getFlashcards,
  getFlashcardById,
  updateFlashcard,
  deleteFlashcard,
} from "./flashcards.controller.js";

const router = Router();

// All flashcard routes require authentication
router.use(authMiddleware);

// Create a flashcard
router.post("/", createFlashcard);

// Get all flashcards
router.get("/", getFlashcards);

// Get one flashcard
router.get("/:id", getFlashcardById);

// Update a flashcard
router.patch("/:id", updateFlashcard);

// Delete a flashcard
router.delete("/:id", deleteFlashcard);

export default router;

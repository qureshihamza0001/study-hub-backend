import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

import {
  summarizeTextController,
  summarizeNoteController,
  summarizeMaterialController,
} from "./ai-summarizer.controller.js";

const router = Router();

// All summarizer routes require authentication
router.use(authMiddleware);

// Summarize directly provided text
router.post("/text", summarizeTextController);

// Summarize an existing note
router.post("/note", summarizeNoteController);

// Summarize an uploaded study material
router.post("/material", summarizeMaterialController);

export default router;
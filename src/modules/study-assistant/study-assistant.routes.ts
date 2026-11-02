import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { askQuestionController } from "./study-assistant.controller.js";

const router = Router();

// Protect all Study Assistant routes
router.use(authMiddleware);

// Ask a question about uploaded study material
router.post("/ask", askQuestionController);

export default router;
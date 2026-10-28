
import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import * as quizzesService from "./quizzes.service.js";
import {
  createQuizSchema,
  updateQuizSchema,
} from "./quizzes.validation.js";

export async function create(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const parsed = createQuizSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz data",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const quiz = await quizzesService.createQuiz(userId, parsed.data);

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Study material not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create quiz error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create quiz",
    });
  }
}

export async function getAll(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const quizzes = await quizzesService.getQuizzes(userId);

    return res.status(200).json({
      success: true,
      message: "Quizzes fetched successfully",
      data: quizzes,
    });
  } catch (error) {
    console.error("Get quizzes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
}

export async function getOne(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz ID",
    });
  }

  try {
    const quiz = await quizzesService.getQuizById(userId, id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz fetched successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("Get quiz error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
}

export async function update(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz ID",
    });
  }

  const parsed = updateQuizSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz data",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const quiz = await quizzesService.updateQuiz(userId, id, parsed.data);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("Update quiz error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update quiz",
    });
  }
}

export async function remove(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz ID",
    });
  }

  try {
    const result = await quizzesService.deleteQuiz(userId, id);

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Delete quiz error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
    });
  }
}

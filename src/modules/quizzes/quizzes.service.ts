
import prisma from "../../config/prisma.js";
import type {
  CreateQuizInput,
  UpdateQuizInput,
} from "./quizzes.validation.js";

// Create a new quiz
export async function createQuiz(
  userId: string,
  input: CreateQuizInput
) {
  const { materialId, ...quizData } = input;

  if (materialId) {
    const material = await prisma.studyMaterial.findFirst({
      where: {
        id: materialId,
        userId,
      },
      select: { id: true },
    });

    if (!material) {
      throw new Error("Study material not found");
    }
  }

  return prisma.quiz.create({
    data: {
      ...quizData,
      userId,
      ...(materialId ? { materialId } : {}),
    },
  });
}

// Get all quizzes belonging to the logged-in user
export async function getQuizzes(userId: string) {
  return prisma.quiz.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      materialId: true,
    },
  });
}

// Get a single quiz by ID
export async function getQuizById(
  userId: string,
  id: string
) {
  return prisma.quiz.findFirst({
    where: {
      id,
      userId,
    },
  });
}

// Update an existing quiz
export async function updateQuiz(
  userId: string,
  id: string,
  input: UpdateQuizInput
) {
  const existingQuiz = await prisma.quiz.findFirst({
    where: {
      id,
      userId,
    },
    select: { id: true },
  });

  if (!existingQuiz) {
    return null;
  }

  return prisma.quiz.update({
    where: { id },
    data: input,
  });
}

// Delete a quiz belonging to the logged-in user
export async function deleteQuiz(
  userId: string,
  id: string
) {
  return prisma.quiz.deleteMany({
    where: {
      id,
      userId,
    },
  });
}


import prisma from "../../config/prisma.js";
import type {
  CreateFlashcardInput,
  UpdateFlashcardInput,
} from "./flashcards.validation.js";

// Create a flashcard
export async function createFlashcard(
  userId: string,
  input: CreateFlashcardInput
) {
  const { noteId, materialId, ...flashcardData } = input;

  // Check that the note belongs to the logged-in user
  if (noteId) {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
      select: { id: true },
    });

    if (!note) {
      throw new Error("Note not found");
    }
  }

  // Check that the study material belongs to the logged-in user
  if (materialId) {
    const material = await prisma.studyMaterial.findFirst({
      where: { id: materialId, userId },
      select: { id: true },
    });

    if (!material) {
      throw new Error("Study material not found");
    }
  }

  return prisma.flashcard.create({
    data: {
      ...flashcardData,
      userId,
      ...(noteId ? { noteId } : {}),
      ...(materialId ? { materialId } : {}),
    },
  });
}

// Get all flashcards belonging to the logged-in user
export async function getFlashcards(userId: string) {
  return prisma.flashcard.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// Get one flashcard belonging to the logged-in user
export async function getFlashcardById(
  userId: string,
  id: string
) {
  return prisma.flashcard.findFirst({
    where: { id, userId },
  });
}

// Update a flashcard
export async function updateFlashcard(
  userId: string,
  id: string,
  input: UpdateFlashcardInput
) {
  const existing = await prisma.flashcard.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  const { noteId, materialId, ...flashcardData } = input;

  // Validate ownership of a newly linked note
  if (noteId) {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
      select: { id: true },
    });

    if (!note) {
      throw new Error("Note not found");
    }
  }

  // Validate ownership of a newly linked study material
  if (materialId) {
    const material = await prisma.studyMaterial.findFirst({
      where: { id: materialId, userId },
      select: { id: true },
    });

    if (!material) {
      throw new Error("Study material not found");
    }
  }

  return prisma.flashcard.update({
    where: { id },
    data: {
      ...flashcardData,
      ...(noteId !== undefined ? { noteId } : {}),
      ...(materialId !== undefined ? { materialId } : {}),
    },
  });
}

// Delete a flashcard belonging to the logged-in user
export async function deleteFlashcard(
  userId: string,
  id: string
) {
  return prisma.flashcard.deleteMany({
    where: { id, userId },
  });
}

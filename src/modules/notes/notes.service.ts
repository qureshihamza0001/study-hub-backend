
import prisma from "../../config/prisma.js";
import type {
  CreateNoteInput,
  UpdateNoteInput,
} from "./notes.validation.js";

export async function createNote(userId: string, input: CreateNoteInput) {
  return prisma.note.create({
    data: {
      ...input,
      userId,
    },
  });
}

export async function getNotes(userId: string) {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getNoteById(userId: string, noteId: string) {
  return prisma.note.findFirst({
    where: {
      id: noteId,
      userId,
    },
  });
}

export async function updateNote(
  userId: string,
  noteId: string,
  input: UpdateNoteInput
) {
  const result = await prisma.note.updateMany({
    where: {
      id: noteId,
      userId,
    },
    data: input,
  });

  if (result.count === 0) {
    return null;
  }

  return getNoteById(userId, noteId);
}

export async function deleteNote(userId: string, noteId: string) {
  const result = await prisma.note.deleteMany({
    where: {
      id: noteId,
      userId,
    },
  });

  return result.count > 0;
}

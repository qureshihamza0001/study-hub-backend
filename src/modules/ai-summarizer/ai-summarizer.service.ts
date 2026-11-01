import prisma from "../../config/prisma.js";
import type {
  SummarizeTextInput,
  SummarizeNoteInput,
  SummarizeMaterialInput,
} from "./ai-summarizer.validation.js";

// Temporary summarizer until we connect an AI provider.
function createPlaceholderSummary(text: string, length: string) {
  const cleanText = text.trim().replace(/\s+/g, " ");

  const wordLimit =
    length === "short" ? 30 :
    length === "detailed" ? 150 : 75;

  const words = cleanText.split(" ");

  const summary = words.slice(0, wordLimit).join(" ");

  return words.length > wordLimit ? `${summary}...` : summary;
}

export async function summarizeText(input: SummarizeTextInput) {
  return {
    summary: createPlaceholderSummary(input.text, input.length),
    length: input.length,
    provider: "placeholder",
    message: "Placeholder summary. Connect an AI provider for genuine AI-generated summaries.",
  };
}

export async function summarizeNote(
  userId: string,
  input: SummarizeNoteInput
) {
  const note = await prisma.note.findFirst({
    where: {
      id: input.noteId,
      userId,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return summarizeText({
    text: note.content,
    length: input.length,
  });
}

export async function summarizeMaterial(
  userId: string,
  input: SummarizeMaterialInput
) {
  const material = await prisma.studyMaterial.findFirst({
    where: {
      id: input.materialId,
      userId,
    },
  });

  if (!material) {
    throw new Error("Study material not found");
  }

  if (!material.extractedText?.trim()) {
    throw new Error("No extracted text available for this material");
  }

  return summarizeText({
    text: material.extractedText,
    length: input.length,
  });
}
import prisma from "../../config/prisma.js";
import type { AskQuestionInput } from "./study-assistant.validation.js";

export async function askQuestion(
  userId: string,
  input: AskQuestionInput
) {
  // Find the uploaded study material
  const material = await prisma.studyMaterial.findFirst({
    where: {
      id: input.materialId,
      userId,
    },
  });

  if (!material) {
    throw new Error("Study material not found");
  }

  // Check whether extracted text is available
  if (!material.extractedText?.trim()) {
    throw new Error("No extracted text available for this material");
  }

  // Get extracted text
  const text: string = material.extractedText;

  // Extract keywords from the question
  const keywords: string[] = input.question
    .toLowerCase()
    .split(/\s+/)
    .filter((word: string) => word.length > 3);

  // Split text into individual sentences
  const sentences: string[] = text
    .split(/[.!?\n]+/)
    .map((sentence: string) => sentence.trim())
    .filter((sentence: string) => sentence.length > 0);

  // Find sentences relevant to the question
  const relevantSentences: string[] = sentences.filter(
    (sentence: string) =>
      keywords.some((keyword: string) =>
        sentence.toLowerCase().includes(keyword)
      )
  );

  // Prepare context for the answer
  const context: string = relevantSentences.length > 0
    ? relevantSentences.slice(0, 5).join(". ")
    : text.slice(0, 1000);

  return {
    question: input.question,
    answer: context,
    materialId: material.id,
    materialTitle: material.title,
    provider: "placeholder",
    message:
      "Temporary keyword-based retrieval. Connect an AI provider for genuine AI-generated answers.",
  };
}
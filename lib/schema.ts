import { z } from "zod";

export const digestSchema = z.object({
  title: z.string().describe("The title of the article or webpage"),
  summary: z
    .array(z.string())
    .describe("An array of summary paragraphs (2-4 paragraphs)"),
  keyTakeaways: z
    .array(z.string())
    .describe("An array of 3-5 key takeaways from the content"),
  quiz: z
    .array(
      z.object({
        question: z.string().describe("A quiz question based on the content"),
        options: z
          .array(z.string())
          .length(4)
          .describe("Four multiple choice options"),
        correctAnswer: z
          .number()
          .min(0)
          .max(3)
          .describe("Index of the correct answer (0-3)"),
      }),
    )
    .length(3)
    .describe("Exactly 3 quiz questions"),
});

export type DigestResult = z.infer<typeof digestSchema>;

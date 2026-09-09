import { z } from "zod";

export const AskQuestionFormSchema = z.object({
  question: z.string().min(3).max(1000),
});
export type AskQuestionFormInput = z.infer<typeof AskQuestionFormSchema>;

export const AnswerQuestionFormSchema = z.object({
  answer: z.string().min(1).max(2000),
});
export type AnswerQuestionFormInput = z.infer<typeof AnswerQuestionFormSchema>;

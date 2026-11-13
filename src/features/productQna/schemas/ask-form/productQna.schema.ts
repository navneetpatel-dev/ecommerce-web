import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { UGC_LIMITS } from "@/shared/constants/ugc/ugcLimits";
import { ugcTextSchema } from "@/shared/schemas/ugcText.schema";

export const AskQuestionFormSchema = z.object({
  question: ugcTextSchema(LABELS.ugcQuestionLabel, UGC_LIMITS.question),
});
export type AskQuestionFormInput = z.infer<typeof AskQuestionFormSchema>;

export const AnswerQuestionFormSchema = z.object({
  answer: ugcTextSchema(LABELS.ugcAnswerLabel, UGC_LIMITS.answer),
});
export type AnswerQuestionFormInput = z.infer<typeof AnswerQuestionFormSchema>;

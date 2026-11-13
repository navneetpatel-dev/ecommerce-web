import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { UGC_LIMITS } from "@/shared/constants/ugc/ugcLimits";
import { ugcTextSchema } from "@/shared/schemas/ugcText.schema";

export const ReviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  title: ugcTextSchema(LABELS.ugcTitleLabel, UGC_LIMITS.reviewTitle).optional(),
  body: ugcTextSchema(LABELS.ugcReviewLabel, UGC_LIMITS.reviewBody),
});

export type ReviewFormInput = z.infer<typeof ReviewFormSchema>;

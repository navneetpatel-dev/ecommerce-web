import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { UGC_LIMITS } from "@/shared/constants/ugc/ugcLimits";
import { ugcTextSchema } from "@/shared/schemas/ugcText.schema";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

export const ReviewFormSchema = z.object({
  rating: z.number().min(1, LABELS.selectReviewRating).max(5),
  title: ugcTextSchema(LABELS.ugcTitleLabel, UGC_LIMITS.reviewTitle).optional(),
  body: z
    .string()
    .trim()
    .max(
      UGC_LIMITS.reviewBody.max,
      formatLabel(LABELS.ugcTooLong, {
        label: LABELS.ugcReviewLabel,
        max: UGC_LIMITS.reviewBody.max,
      }),
    ),
});

export type ReviewFormInput = z.infer<typeof ReviewFormSchema>;

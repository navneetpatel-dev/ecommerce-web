import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import {
  BUG_DESCRIPTION_MAX,
  BUG_STEPS_MAX,
  BUG_TITLE_MAX,
} from "../constants/fieldLimits";

export const BUG_ATTACHMENT_TYPES = ["SCREENSHOT", "SCREEN_RECORDING"] as const;

export type BugAttachmentType = (typeof BUG_ATTACHMENT_TYPES)[number];

/** Attachment payload required for each uploaded bug-report file. */
export const bugAttachmentSchema = z.object({
  url: z.string().min(1),
  type: z.enum(BUG_ATTACHMENT_TYPES),
  durationSeconds: z.number().nullable(),
});

/** Full bug report draft: shape, limits, and messages (Rule 16). */
export const BugReportSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, LABELS.bugTitleRequired)
    .max(
      BUG_TITLE_MAX,
      formatLabel(LABELS.bugTitleTooLong, { max: String(BUG_TITLE_MAX) }),
    ),
  description: z
    .string()
    .trim()
    .min(1, LABELS.bugDescriptionRequired)
    .max(
      BUG_DESCRIPTION_MAX,
      formatLabel(LABELS.bugDescriptionTooLong, {
        max: String(BUG_DESCRIPTION_MAX),
      }),
    ),
  steps: z
    .string()
    .trim()
    .max(
      BUG_STEPS_MAX,
      formatLabel(LABELS.bugStepsTooLong, { max: String(BUG_STEPS_MAX) }),
    ),
  attachments: z
    .array(bugAttachmentSchema)
    .refine((list) => list.every((item) => item.type != null), {
      message: LABELS.bugAttachmentTypeMissing,
      path: ["attachments"],
    }),
});

export type BugReportInput = z.infer<typeof BugReportSchema>;

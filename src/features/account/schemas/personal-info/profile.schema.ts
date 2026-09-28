import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { phoneField } from "@/shared/schemas/phone.schema";

/** Account profile name limit (Rule 8: limits live with the schema). */
export const PROFILE_NAME_MAX = 80;

/** Personal-info form schema; field messages come from centralized copy. */
export const ProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, LABELS.nameRequired)
    .max(PROFILE_NAME_MAX, LABELS.couldNotSaveProfile),
  phone: phoneField,
});

export type ProfileFormInput = z.infer<typeof ProfileSchema>;

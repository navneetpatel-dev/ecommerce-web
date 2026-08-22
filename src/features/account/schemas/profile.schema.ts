import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";

/** Account profile name/phone limits (Rule 8: limits live with the schema). */
export const PROFILE_NAME_MAX = 80;
export const PROFILE_PHONE_MAX = 15;

/** Personal-info form schema; field messages come from centralized copy. */
export const ProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, LABELS.nameRequired)
    .max(PROFILE_NAME_MAX, LABELS.couldNotSaveProfile),
  phone: z
    .string()
    .trim()
    .max(PROFILE_PHONE_MAX, LABELS.couldNotSaveProfile)
    .optional(),
});

export type ProfileFormInput = z.infer<typeof ProfileSchema>;

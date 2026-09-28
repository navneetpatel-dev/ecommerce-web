import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import {
  isBlankPhoneNumber,
  isValidPhoneNumber,
} from "@/shared/utils/validation/phoneNumber";

/**
 * The optional phone field every form shares (Rule 3: one rule, one place).
 * Blank stays blank and an omitted value stays omitted, so the schema's input
 * and output types match (React Hook Form needs that); normalising to digits
 * happens where the payload is built.
 */
export const phoneField = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) =>
      value === undefined ||
      isBlankPhoneNumber(value) ||
      isValidPhoneNumber(value),
    LABELS.invalidPhone,
  );

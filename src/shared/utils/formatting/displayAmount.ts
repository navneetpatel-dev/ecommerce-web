import { LABELS } from "@/shared/constants/labels";

/** A server money or points value as the API sends it: a number, a decimal string, or absent. */
export type DisplayAmountInput = number | string | null | undefined;

/**
 * Shown in place of an amount the server did not send. Never ₹0 — a zero reads
 * as real money, and the client has no figure of its own to fall back to.
 */
export const MISSING_AMOUNT = LABELS.emptyCell;

/** The finite number to display, or null when the server sent nothing usable. */
export function toDisplayAmount(value: DisplayAmountInput): number | null {
  if (value == null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

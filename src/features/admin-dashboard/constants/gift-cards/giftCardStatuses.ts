import type { GiftCardStatus } from "@/features/giftCards";

/** Select value meaning "no status filter" (Radix Select cannot hold an empty value). */
export const ALL_GIFT_CARD_STATUSES = "__all__";

/** Statuses an admin can filter by; PENDING and FAILED are checkouts that never paid. */
export const ADMIN_GIFT_CARD_STATUSES: GiftCardStatus[] = [
  "ACTIVE",
  "REDEEMED",
  "EXPIRED",
  "CANCELLED",
  "PENDING",
  "FAILED",
];

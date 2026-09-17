import { getStatusBadgeVariant } from "@/shared/components/badges/StatusBadge.component";
import type { Tone } from "../../styles/list/orderStatusGroup.styles";

export type Density = "compact" | "comfortable";

export const ORDER_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

export const PAYMENT_LABELS_COMPACT: Record<string, string> = {
  PENDING: "Unpaid",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const PAYMENT_LABELS: Record<string, string> = {
  PENDING: "Awaiting payment",
  PAID: "Paid",
  FAILED: "Payment failed",
  REFUNDED: "Refunded",
};

const BADGE_VARIANT_TO_TONE = {
  success: "positive",
  brand: "progress",
  warning: "caution",
  destructive: "danger",
  secondary: "neutral",
  tag: "neutral",
  outline: "neutral",
} as const;

export function badgeVariantToTone(
  variant: ReturnType<typeof getStatusBadgeVariant>,
): Tone {
  return BADGE_VARIANT_TO_TONE[variant];
}

export function orderTone(status: string): Tone {
  return badgeVariantToTone(getStatusBadgeVariant(status));
}

export function paymentTone(status: string): Tone {
  return badgeVariantToTone(getStatusBadgeVariant(status));
}

export function displayLabel(
  kind: "order" | "payment",
  status: string,
  density: Density,
): string {
  const key = status.toUpperCase();
  if (kind === "payment") {
    const map = density === "compact" ? PAYMENT_LABELS_COMPACT : PAYMENT_LABELS;
    return map[key] ?? status.replace(/_/g, " ");
  }
  return ORDER_LABELS[key] ?? status.replace(/_/g, " ");
}

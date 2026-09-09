import { ORDER_STATUS, PAYMENT_STATUS } from "@/shared/constants/statuses";
import type { Tone } from "../../components/list/orderStatusGroup.styles";

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

export function orderTone(status: string): Tone {
  const key = status.toUpperCase();
  if (key === ORDER_STATUS.DELIVERED || key === ORDER_STATUS.CONFIRMED) {
    return "positive";
  }
  if (key === ORDER_STATUS.SHIPPED) return "progress";
  if (key === ORDER_STATUS.PENDING) return "caution";
  if (key === ORDER_STATUS.CANCELLED || key === ORDER_STATUS.RETURNED) {
    return "danger";
  }
  return "neutral";
}

export function paymentTone(status: string): Tone {
  const key = status.toUpperCase();
  if (key === PAYMENT_STATUS.PAID) return "positive";
  if (key === PAYMENT_STATUS.PENDING) return "caution";
  if (key === PAYMENT_STATUS.FAILED || key === PAYMENT_STATUS.REFUNDED) {
    return "danger";
  }
  return "neutral";
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

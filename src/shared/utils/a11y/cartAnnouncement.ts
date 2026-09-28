import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

/**
 * What the cart live region says when the count changes. Zero gets its own
 * message: "0 items in your cart" reads as a count, not as the state change
 * ("your cart is empty") the user just caused.
 */
export function cartCountAnnouncement(count: number): string {
  if (count <= 0) return LABELS.cartEmptiedAnnouncement;
  return formatLabel(
    count === 1
      ? LABELS.cartCountOneAnnouncement
      : LABELS.cartCountAnnouncement,
    { count },
  );
}

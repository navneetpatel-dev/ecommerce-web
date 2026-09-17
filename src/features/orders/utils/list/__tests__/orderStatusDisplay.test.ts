import { describe, expect, it } from "vitest";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/shared/constants/statuses";
import { getStatusBadgeVariant } from "@/shared/components/badges/StatusBadge.component";
import {
  badgeVariantToTone,
  orderTone,
  paymentTone,
} from "../orderStatusDisplay.utils";

describe("order status tone unification (F-24)", () => {
  it.each(Object.values(ORDER_STATUS))(
    "CompactStatusLine and StatusBadge share a tone for %s",
    (status) => {
      expect(orderTone(status)).toBe(
        badgeVariantToTone(getStatusBadgeVariant(status)),
      );
    },
  );

  it.each(Object.values(PAYMENT_STATUS))(
    "CompactStatusLine and StatusBadge share a payment tone for %s",
    (status) => {
      expect(paymentTone(status)).toBe(
        badgeVariantToTone(getStatusBadgeVariant(status)),
      );
    },
  );

  it("classifies RETURNED as caution (StatusBadge warning), not danger", () => {
    expect(getStatusBadgeVariant(ORDER_STATUS.RETURNED)).toBe("warning");
    expect(orderTone(ORDER_STATUS.RETURNED)).toBe("caution");
  });
});

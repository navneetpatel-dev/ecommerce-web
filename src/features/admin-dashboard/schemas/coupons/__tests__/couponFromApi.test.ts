import { describe, expect, it } from "vitest";
import type { Coupon } from "@/shared/api/types";
import {
  couponLockedFields,
  couponToFormValues,
  CouponSchema,
  toCouponCreateBody,
} from "../coupons.schema";

const base: Coupon = {
  id: "c-1",
  code: "SAVE10",
  type: "PERCENTAGE",
  value: 10,
  maxDiscountCap: 200,
  minOrderValue: 999,
  minQuantity: null,
  applicableScope: {
    type: "category",
    ids: ["11111111-1111-4111-8111-111111111111"],
  },
  userRestriction: { type: "segment", value: "returning" },
  config: {},
  usageLimitTotal: 100,
  usageLimitPerUser: 1,
  usedCount: 0,
  startDate: "2026-11-01T00:00:00.000Z",
  endDate: "2026-12-01T00:00:00.000Z",
  stackable: false,
  priority: 0,
  status: "ACTIVE",
  vendorId: null,
  discountBearer: "PLATFORM",
  batchId: null,
};

describe("couponToFormValues", () => {
  it("round-trips a saved coupon back into the same request body", () => {
    const values = couponToFormValues(base);
    expect(CouponSchema.safeParse(values).success).toBe(true);
    const body = toCouponCreateBody(values);
    expect(body).toMatchObject({
      code: "SAVE10",
      type: "PERCENTAGE",
      value: 10,
      maxDiscountCap: 200,
      minOrderValue: 999,
      applicableScope: base.applicableScope,
      usageLimitTotal: 100,
      discountBearer: "PLATFORM",
      startDate: base.startDate,
      endDate: base.endDate,
    });
  });

  it("puts a tiered coupon's tiers back into the tier fields", () => {
    const values = couponToFormValues({
      ...base,
      type: "TIERED",
      value: null,
      minOrderValue: null,
      config: {
        tiers: [
          { minSubtotal: 500, percent: 5 },
          { minSubtotal: 2000, percent: 12 },
        ],
      },
    });
    expect(values).toMatchObject({
      value: 5,
      minOrderValue: 500,
      tier2MinSubtotal: 2000,
      tier2Percent: 12,
    });
    expect(toCouponCreateBody(values).config).toEqual({
      tiers: [
        { minSubtotal: 500, percent: 5 },
        { minSubtotal: 2000, percent: 12 },
      ],
    });
  });

  it("locks code, type and bearer only once the coupon has been used", () => {
    expect(couponLockedFields({ usedCount: 0 })).toEqual([]);
    expect(couponLockedFields({ usedCount: 2 })).toEqual([
      "code",
      "type",
      "discountBearer",
    ]);
  });
});

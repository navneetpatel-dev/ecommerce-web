import { describe, expect, it } from "vitest";
import type { Coupon } from "@/shared/api/types";
import {
  CouponEditSchema,
  CouponSchema,
  COUPON_FORM_DEFAULTS,
} from "../couponShape.schema";
import {
  toCouponCreateBody,
  toCouponFormValues,
  toCouponUpdateBody,
} from "../couponMapping.schema";

const coupon: Coupon = {
  id: "c1",
  code: "SAVE10",
  type: "PERCENTAGE",
  value: 10,
  maxDiscountCap: 100,
  minOrderValue: 500,
  minQuantity: null,
  applicableScope: { type: "all", ids: [] },
  excludedItems: {
    productIds: ["11111111-1111-4111-8111-111111111111"],
    categoryIds: [],
  },
  userRestriction: { type: "all" },
  config: {},
  usageLimitTotal: null,
  usageLimitPerUser: 1,
  usedCount: 0,
  startDate: "2026-01-01T00:00:00.000Z",
  endDate: "2026-01-02T00:00:00.000Z",
  stackable: false,
  priority: 0,
  status: "ACTIVE",
  vendorId: null,
  discountBearer: "PLATFORM",
  batchId: null,
};

describe("coupon form mapping", () => {
  it("#12: an unchanged edit leaves the code, type and dates out", () => {
    const body = toCouponUpdateBody(toCouponFormValues(coupon), coupon);
    expect(body).not.toHaveProperty("code");
    expect(body).not.toHaveProperty("type");
    expect(body).not.toHaveProperty("startDate");
    expect(body).not.toHaveProperty("endDate");
    expect(body.value).toBe(10);
  });

  it("#12: a past end date can stay when editing, but not when creating", () => {
    const values = toCouponFormValues(coupon);
    expect(CouponEditSchema.safeParse(values).success).toBe(true);
    expect(CouponSchema.safeParse(values).success).toBe(false);
  });

  it("#32: exclusions survive the round trip", () => {
    const body = toCouponCreateBody(toCouponFormValues(coupon));
    expect(body.excludedItems.productIds).toEqual(
      coupon.excludedItems?.productIds,
    );
  });

  it("#1: the form no longer sends who pays", () => {
    expect(toCouponCreateBody(toCouponFormValues(coupon))).not.toHaveProperty(
      "discountBearer",
    );
  });

  it("#27: the per-user limit defaults to one", () => {
    expect(COUPON_FORM_DEFAULTS.usageLimitPerUser).toBe(1);
  });

  it("#43: BOGO carries no leftover value; odd code characters are refused", () => {
    const values = { ...toCouponFormValues(coupon), type: "BOGO" as const };
    expect(toCouponCreateBody(values).value).toBeNull();
    const parsed = CouponSchema.safeParse({
      ...COUPON_FORM_DEFAULTS,
      code: "10% OFF!",
      value: 10,
      startDate: new Date(Date.now() - 1000).toISOString(),
      endDate: new Date(Date.now() + 100000).toISOString(),
    });
    expect(parsed.success).toBe(false);
  });
});

describe("editing a tiered coupon", () => {
  const tiers = [
    { minSubtotal: 999, percent: 5 },
    { minSubtotal: 2999, percent: 10 },
    { minSubtotal: 4999, percent: 15 },
  ];
  const tiered: Coupon = {
    ...coupon,
    type: "TIERED",
    value: null,
    minOrderValue: 299,
    config: { tiers },
  };

  it("an unchanged edit keeps every tier, the value and the minimum order", () => {
    const body = toCouponUpdateBody(toCouponFormValues(tiered), tiered);
    expect(body.config).toEqual({ tiers });
    expect(body).not.toHaveProperty("value");
    expect(body).not.toHaveProperty("minOrderValue");
  });

  it("changing a shown tier keeps the ones the form has no fields for", () => {
    const values = {
      ...toCouponFormValues(tiered),
      value: 7,
      tier2Percent: 12,
    };
    const body = toCouponUpdateBody(values, tiered);
    expect(body.value).toBe(7);
    expect(body.config).toEqual({
      tiers: [
        { minSubtotal: 999, percent: 7 },
        { minSubtotal: 2999, percent: 12 },
        tiers[2],
      ],
    });
  });

  it("changing the type drops the tiers", () => {
    const values = {
      ...toCouponFormValues(tiered),
      type: "PERCENTAGE" as const,
    };
    expect(toCouponUpdateBody(values, tiered).config).toEqual({});
  });
});

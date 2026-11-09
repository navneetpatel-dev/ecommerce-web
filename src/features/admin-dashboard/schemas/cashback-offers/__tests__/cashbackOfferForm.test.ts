import { describe, expect, it } from "vitest";
import {
  CashbackOfferFormSchema,
  cashbackOfferToFormValues,
  toCashbackOfferInput,
} from "../cashbackOfferForm.schema";

describe("cashback offer form", () => {
  it("round-trips a stored offer, with no cap and no end as null", () => {
    const values = cashbackOfferToFormValues({
      id: "o1",
      name: "5% back",
      percent: 5,
      maxCashback: null,
      minOrderValue: 999,
      categoryIds: ["c1"],
      paymentMethods: ["RAZORPAY"],
      startsAt: "2026-11-01T00:00:00.000Z",
      endsAt: null,
      isActive: true,
      state: "LIVE",
    });
    expect(values.maxCashback).toBeUndefined();
    expect(values.endsAt).toBe("");
    expect(toCashbackOfferInput(values)).toEqual({
      name: "5% back",
      percent: 5,
      maxCashback: null,
      minOrderValue: 999,
      categoryIds: ["c1"],
      paymentMethods: ["RAZORPAY"],
      startsAt: "2026-11-01T00:00:00.000Z",
      endsAt: null,
      isActive: true,
    });
  });

  it("rejects an end before the start and a percent over 100", () => {
    const base = cashbackOfferToFormValues(null);
    const early = CashbackOfferFormSchema.safeParse({
      ...base,
      name: "Weekend offer",
      startsAt: "2026-11-10T00:00:00.000Z",
      endsAt: "2026-11-09T00:00:00.000Z",
    });
    expect(early.success).toBe(false);
    expect(early.error?.issues[0]?.path).toEqual(["endsAt"]);
    const big = CashbackOfferFormSchema.safeParse({
      ...base,
      name: "Too much",
      percent: 150,
    });
    expect(big.success).toBe(false);
  });
});

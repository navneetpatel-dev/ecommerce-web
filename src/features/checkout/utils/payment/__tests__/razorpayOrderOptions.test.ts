import { afterEach, describe, expect, it, vi } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import {
  razorpayDismissNotice,
  razorpayOrderExtras,
} from "../razorpayOrderOptions";

describe("razorpayOrderExtras", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("passes the customer, the order's checkout config and the prefill", () => {
    expect(
      razorpayOrderExtras(
        {
          orderId: "o-1",
          razorpayCustomerId: "cust_1",
          checkoutConfigId: "cfg_order",
        },
        { email: "a@b.c" },
      ),
    ).toEqual({
      customer_id: "cust_1",
      checkout_config_id: "cfg_order",
      prefill: { email: "a@b.c" },
    });
  });

  it("falls back to the configured checkout config and leaves out what is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_RAZORPAY_CHECKOUT_CONFIG_ID", "cfg_env");
    expect(razorpayOrderExtras({ orderId: "o-1" }, undefined)).toEqual({
      checkout_config_id: "cfg_env",
    });
    vi.stubEnv("NEXT_PUBLIC_RAZORPAY_CHECKOUT_CONFIG_ID", "");
    expect(razorpayOrderExtras({ orderId: "o-1" }, undefined)).toEqual({});
  });
});

describe("razorpayDismissNotice", () => {
  it("reports the last failure, or a plain cancel when nothing failed", () => {
    expect(razorpayDismissNotice("Card declined")).toEqual({
      variant: "danger",
      title: LABELS.paymentFailedTitle,
      description: "Card declined",
    });
    expect(razorpayDismissNotice(null)).toEqual({
      variant: "info",
      title: LABELS.paymentCancelledTitle,
      description: LABELS.paymentCancelledBody,
    });
  });
});

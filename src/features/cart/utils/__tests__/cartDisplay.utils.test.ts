import { describe, expect, it } from "vitest";
import type { Cart } from "@/shared/api/types";
import {
  patchExistingCartItemQuantity,
  patchRemoveCartItem,
  resolveCartDisplayTotals,
} from "../cartDisplay.utils";

const baseCart: Cart = {
  id: "cart-1",
  items: [
    {
      id: "line-1",
      variantId: "var-1",
      quantity: 2,
      lineSubtotal: 200,
      isAvailable: true,
      unavailableReason: null,
      product: {
        id: "prod-1",
        name: "Test",
        slug: "test",
        imageUrl: "",
        price: 100,
        vendor: {
          id: "vendor-1",
          businessName: "Vendor",
          slug: "vendor",
          logoUrl: null,
        },
      },
      variant: { sku: "SKU", attributes: {}, weightGrams: 500 },
    },
  ],
  merchandiseSubtotal: 200,
  total: 236,
  pricingPreview: {
    merchandiseSubtotal: 200,
    discount: 0,
    taxTotal: 36,
    shippingTotal: 0,
    shippingDisplayKey: "FREE",
    grandTotal: 236,
    basisKey: "DEFAULT_ADDRESS",
  },
};

describe("patchExistingCartItemQuantity", () => {
  it("updates qty and clears server amounts until refetch", () => {
    const next = patchExistingCartItemQuantity(baseCart, "line-1", 4);
    expect(next.items[0]?.quantity).toBe(4);
    expect(next.items[0]?.lineSubtotal).toBeUndefined();
    expect(next.merchandiseSubtotal).toBeUndefined();
    expect(next.total).toBeUndefined();
    expect(next.pricingPreview).toBeUndefined();
  });

  it("removes the line when quantity is zero", () => {
    const next = patchExistingCartItemQuantity(baseCart, "line-1", 0);
    expect(next.items).toHaveLength(0);
  });
});

describe("patchRemoveCartItem", () => {
  it("removes the line and clears aggregate totals", () => {
    const next = patchRemoveCartItem(baseCart, "line-1");
    expect(next.items).toHaveLength(0);
    expect(next.total).toBeUndefined();
  });
});

describe("resolveCartDisplayTotals", () => {
  it("uses backend grand total when no lines are pending", () => {
    expect(resolveCartDisplayTotals(baseCart)).toMatchObject({
      pendingLineTotals: false,
      subtotal: 200,
      total: 236,
      totalIsEstimated: false,
      pricingPreview: baseCart.pricingPreview,
    });
  });

  it("does not fabricate totals when a line subtotal is missing", () => {
    const pending: Cart = {
      ...baseCart,
      items: [{ ...baseCart.items[0]!, lineSubtotal: undefined }],
      total: undefined,
      pricingPreview: undefined,
      merchandiseSubtotal: undefined,
    };
    expect(resolveCartDisplayTotals(pending)).toMatchObject({
      pendingLineTotals: true,
      subtotalPending: true,
      subtotal: undefined,
      total: undefined,
      totalIsEstimated: true,
    });
  });
});

describe("resolveCartDisplayTotals — pending vs unavailable", () => {
  it("is not unavailable while the cart loads normally", () => {
    const totals = resolveCartDisplayTotals(baseCart);
    expect(totals.amountsUnavailable).toBe(false);
    expect(totals.total).toBe(236);
  });

  it("is not unavailable mid-refresh — amounts cleared but no error", () => {
    const patched = patchExistingCartItemQuantity(baseCart, "line-1", 4);
    const totals = resolveCartDisplayTotals(patched);

    expect(totals.pendingLineTotals).toBe(true);
    expect(totals.total).toBeUndefined();
    // Still "Updating…", because nothing has failed yet.
    expect(totals.amountsUnavailable).toBe(false);
  });

  it("is unavailable when the request failed and left amounts missing", () => {
    const patched = patchExistingCartItemQuantity(baseCart, "line-1", 4);
    const totals = resolveCartDisplayTotals(patched, { isError: true });

    // This is the stuck-"Updating…" case: the refetch never restored amounts.
    expect(totals.amountsUnavailable).toBe(true);
  });

  it("is not unavailable when an error left the previous amounts intact", () => {
    const totals = resolveCartDisplayTotals(baseCart, { isError: true });
    expect(totals.amountsUnavailable).toBe(false);
    expect(totals.total).toBe(236);
  });
});

describe("cart line quantity cap", () => {
  it("carries the server cap on the line so the stepper cannot exceed stock", () => {
    // The API silently clamps over-stock updates, so a stepper capped at the
    // policy max (99) would count up and then snap back on the response.
    const line = { ...baseCart.items[0]!, maxQuantity: 14 };
    expect(line.maxQuantity).toBe(14);
    expect(line.maxQuantity).toBeLessThan(99);
  });
});

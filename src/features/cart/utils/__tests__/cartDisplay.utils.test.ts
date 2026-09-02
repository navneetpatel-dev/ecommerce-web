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
    grandTotal: 236,
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

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { CurrentUser } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { productsApi } from "../../api/listing/products.api";
import { useProductVariantsDialog } from "../../hooks/product-editor/useProductVariantsDialog.hook";

vi.mock("@/shared/stores/notifications/toast.store", () => ({
  notifySuccess: vi.fn(),
}));

const liveProduct = {
  id: "p1",
  status: "LIVE",
  vendorId: "v1",
  listedByPlatform: false,
  variants: [
    { id: "var1", sku: "S1", price: 100, stock: 5, attributes: { Size: "M" } },
  ],
};

function signIn(role: CurrentUser["role"], vendorId: string | null) {
  useAuthStore.setState({
    accessToken: "t",
    currentUser: {
      id: "u1",
      email: "u@example.com",
      name: "U",
      phone: null,
      role,
      permissions: [],
      vendorId,
      emailVerified: true,
    } as CurrentUser,
  });
}

async function mount() {
  const hook = renderHook(() =>
    useProductVariantsDialog({ productId: "p1", open: true }),
  );
  await waitFor(() => expect(hook.result.current.rows).toHaveLength(1));
  return hook;
}

beforeEach(() => {
  vi.spyOn(productsApi, "detail").mockResolvedValue(liveProduct as never);
  vi.spyOn(productsApi, "updateVariant").mockResolvedValue({} as never);
  vi.spyOn(productsApi, "addVariant").mockResolvedValue({} as never);
});
afterEach(() => {
  vi.restoreAllMocks();
  useAuthStore.setState({ accessToken: null, currentUser: null });
});

describe("managing the variants of a live vendor product as Super Admin", () => {
  it("a stock-only change needs no reason", async () => {
    signIn("SUPER_ADMIN", null);
    const { result } = await mount();
    act(() => result.current.patchExisting("var1", { stock: "9" }));
    act(() => result.current.saveExisting("var1"));
    await waitFor(() =>
      expect(productsApi.updateVariant).toHaveBeenCalledWith("var1", {
        attributes: { Size: "M" },
        stock: 9,
      }),
    );
  });

  it("a price change is refused without a written reason, and sent with one", async () => {
    signIn("SUPER_ADMIN", null);
    const { result } = await mount();
    act(() => result.current.patchExisting("var1", { price: "80" }));
    act(() => result.current.saveExisting("var1"));
    expect(productsApi.updateVariant).not.toHaveBeenCalled();
    expect(result.current.reasonError).toBe(LABELS.priceChangeReasonRequired);

    act(() => result.current.handleReasonChange("Vendor asked us to lower it"));
    act(() => result.current.saveExisting("var1"));
    await waitFor(() =>
      expect(productsApi.updateVariant).toHaveBeenCalledWith(
        "var1",
        expect.objectContaining({
          price: 80,
          changeReason: "Vendor asked us to lower it",
        }),
      ),
    );
  });

  it("adding a variant counts as a price change: it needs the reason too", async () => {
    signIn("SUPER_ADMIN", null);
    const { result } = await mount();
    act(() => result.current.addNewRow());
    const key = result.current.newRows[0]!.key;
    act(() => result.current.patchNew(key, { sku: "S2", price: "50" }));
    act(() => result.current.saveNew(key));
    expect(productsApi.addVariant).not.toHaveBeenCalled();
    act(() => result.current.handleReasonChange("Vendor sells a new size"));
    act(() => result.current.saveNew(key));
    await waitFor(() =>
      expect(productsApi.addVariant).toHaveBeenCalledWith(
        "p1",
        expect.objectContaining({
          sku: "S2",
          price: 50,
          changeReason: "Vendor sells a new size",
        }),
      ),
    );
  });

  it("an incomplete new row is not sent (SKU and price are required)", async () => {
    signIn("SUPER_ADMIN", null);
    const { result } = await mount();
    act(() => result.current.addNewRow());
    const key = result.current.newRows[0]!.key;
    act(() => result.current.saveNew(key));
    expect(productsApi.addVariant).not.toHaveBeenCalled();
    expect(result.current.rowErrors[key]).toEqual({
      sku: LABELS.variantSkuRequired,
      price: LABELS.variantPriceRequired,
    });
  });
});

describe("the vendor owner", () => {
  it("changes a price without any reason", async () => {
    signIn("VENDOR_OWNER", "v1");
    const { result } = await mount();
    expect(result.current.pricing.reasonRequired).toBe(false);
    act(() => result.current.patchExisting("var1", { price: "80" }));
    act(() => result.current.saveExisting("var1"));
    await waitFor(() => expect(productsApi.updateVariant).toHaveBeenCalled());
  });
});

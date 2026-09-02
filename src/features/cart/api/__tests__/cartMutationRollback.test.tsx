import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Cart } from "@/shared/api/types";
import { ApiError } from "@/shared/types/apiError.types";
import { LABELS } from "@/shared/constants/labels";
import { useCartDrawerStore } from "../../store/cart.store";
import { cartApi } from "../cart.api";
import { cartKeys, useUpdateCartItem } from "../cart.queries";

vi.mock("../cart.api", () => ({
  cartApi: {
    updateItem: vi.fn(),
  },
}));

const cart = {
  id: "cart-1",
  items: [
    {
      id: "item-1",
      variantId: "variant-1",
      quantity: 2,
      lineSubtotal: 200,
      isAvailable: true,
      unavailableReason: null,
      product: {
        id: "product-1",
        name: "Test product",
        slug: "test-product",
        imageUrl: "",
        price: 100,
        vendor: {
          id: "vendor-1",
          businessName: "Seller",
          slug: "seller",
          logoUrl: null,
        },
      },
      variant: { sku: "SKU-1", attributes: {} },
    },
  ],
} satisfies Cart;

describe("cart mutation rollback", () => {
  beforeEach(() => {
    useCartDrawerStore.getState().setMutationError(null);
    vi.mocked(cartApi.updateItem).mockReset();
  });

  it("restores the previous quantity and shows the safe backend message", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    queryClient.setQueryData(cartKeys.forAuth(null), cart);
    vi.mocked(cartApi.updateItem).mockRejectedValue(
      new ApiError("VALIDATION_ERROR", "Only 2 items are available."),
    );
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useUpdateCartItem(), { wrapper });

    act(() => result.current.mutate({ itemId: "item-1", quantity: 4 }));

    await waitFor(() => {
      expect(
        queryClient.getQueryData<Cart>(cartKeys.forAuth(null))?.items[0]
          ?.quantity,
      ).toBe(2);
    });
    expect(useCartDrawerStore.getState().mutationError).toBe(
      "Only 2 items are available.",
    );
  });

  it("replaces a browser fetch error with an actionable restore message", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    queryClient.setQueryData(cartKeys.forAuth(null), cart);
    vi.mocked(cartApi.updateItem).mockRejectedValue(
      new TypeError("Failed to fetch"),
    );
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useUpdateCartItem(), { wrapper });

    act(() => result.current.mutate({ itemId: "item-1", quantity: 4 }));

    await waitFor(() => {
      expect(useCartDrawerStore.getState().mutationError).toBe(
        LABELS.couldNotUpdateCart,
      );
    });
    expect(
      queryClient.getQueryData<Cart>(cartKeys.forAuth(null))?.items[0]
        ?.quantity,
    ).toBe(2);
  });
});

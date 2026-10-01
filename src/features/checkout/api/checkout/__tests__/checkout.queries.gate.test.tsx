import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { CurrentUser } from "@/shared/api/types";
import { checkoutApi } from "../checkout.api";
import { useAddresses } from "../checkout.queries";
import { useCheckoutAddresses } from "../../../hooks/address/useCheckoutAddresses.hook";

vi.mock("../checkout.api", () => ({
  checkoutApi: {
    getAddresses: vi.fn(),
    createAddress: vi.fn(),
  },
}));

// `useCheckoutAddresses` pulls the cart, the delivery-area hooks and the auth
// prompt; only the gate under test matters here.
vi.mock("@/features/cart", () => ({
  useCart: () => ({ data: undefined }),
  groupItemsByVendor: () => ({}),
}));

vi.mock("@/shared/hooks/delivery/useDeliveryLocation.hook", () => ({
  useDeliveryLocation: () => ({ setDeliveryLocation: vi.fn() }),
  useDeliveryServiceability: () => ({ isLoading: false }),
}));

vi.mock("@/shared/hooks/auth/useRequireAuth.hook", () => ({
  useRequireAuth: () => ({ requireAuth: () => true, isAuthenticated: true }),
}));

const customer: CurrentUser = {
  id: "user-1",
  email: "shopper@example.com",
  name: "Shopper",
  phone: null,
  role: "CUSTOMER",
  vendorId: null,
  emailVerified: true,
};

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
}

describe("saved addresses wait for the access token", () => {
  beforeEach(() => {
    vi.mocked(checkoutApi.getAddresses).mockReset();
    useAuthStore.setState({
      accessToken: null,
      currentUser: null,
      authBootstrapped: false,
    });
  });

  it("does not ask for addresses when only a snapshot is hydrated", async () => {
    useAuthStore.setState({ currentUser: customer });

    const { result } = renderHook(() => useAddresses(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.fetchStatus).toBe("idle");
    });
    expect(checkoutApi.getAddresses).not.toHaveBeenCalled();
  });

  it("holds the address-step skeleton through the pre-token window", async () => {
    // The compensation for the gate: a disabled query reports `isLoading: false`,
    // so without `awaitingSession` the checkout address step would flash "no
    // saved addresses" for the whole bootstrap window instead of its skeleton.
    useAuthStore.setState({ currentUser: customer });

    const { result } = renderHook(() => useCheckoutAddresses(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.isLoadingAddresses).toBe(true);
    expect(checkoutApi.getAddresses).not.toHaveBeenCalled();
  });

  it("leaves guests untouched — no request, no skeleton", async () => {
    useAuthStore.setState({ authBootstrapped: true });

    const { result } = renderHook(() => useCheckoutAddresses(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.isLoadingAddresses).toBe(false);
    expect(checkoutApi.getAddresses).not.toHaveBeenCalled();
  });

  it("fetches addresses once the token exists", async () => {
    vi.mocked(checkoutApi.getAddresses).mockResolvedValue([]);
    // `authBootstrapped` false is the real order of events (the refresh writes
    // the token before the bootstrap's `finally` flips the flag); the hold keeps
    // the skeleton up through it either way, so the assertion below is that the
    // skeleton is released once the session has settled.
    useAuthStore.setState({
      currentUser: customer,
      accessToken: "token",
      authBootstrapped: true,
    });

    const { result } = renderHook(() => useCheckoutAddresses(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(checkoutApi.getAddresses).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(result.current.isLoadingAddresses).toBe(false);
    });
  });
});

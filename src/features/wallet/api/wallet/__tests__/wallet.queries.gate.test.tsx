import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { CurrentUser } from "@/shared/api/types";
import { walletApi } from "../wallet.api";
import { useWalletBalance, useWalletTransactions } from "../wallet.queries";

vi.mock("../wallet.api", () => ({
  walletApi: {
    getBalance: vi.fn(),
    getTransactions: vi.fn(),
  },
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

describe("wallet queries wait for the access token", () => {
  beforeEach(() => {
    vi.mocked(walletApi.getBalance).mockReset();
    vi.mocked(walletApi.getTransactions).mockReset();
    useAuthStore.setState({
      accessToken: null,
      currentUser: null,
      authBootstrapped: false,
    });
  });

  it("does not ask for a balance when only a snapshot is hydrated", async () => {
    // The cold-load window exactly: the bootstrap has written `currentUser` from
    // localStorage, but the memory-only access token has not arrived yet. Gating
    // on `currentUser` sent `GET /wallet/balance` without a bearer here — the
    // guaranteed 401 (plus refresh + retry) this gate exists to remove.
    useAuthStore.setState({ currentUser: customer });

    const { result } = renderHook(() => useWalletBalance(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.fetchStatus).toBe("idle");
    });
    expect(walletApi.getBalance).not.toHaveBeenCalled();
    // A disabled query reports `isLoading: false`; `useHeader`'s `actionsLoading`
    // is what keeps the badge skeleton up, so nothing flickers for the customer.
    expect(result.current.isLoading).toBe(false);
  });

  it("fetches the balance once the token exists", async () => {
    vi.mocked(walletApi.getBalance).mockResolvedValue({
      balance: 500,
      points: 500,
      unit: "POINT",
      redemptionRate: 1,
      rechargeEnabled: true,
      limits: {
        minInr: 100,
        maxInr: 5000,
        maxBalance: 10000,
        presetsInr: [100, 500],
      },
    });
    useAuthStore.setState({ currentUser: customer, accessToken: "token" });

    const { result } = renderHook(() => useWalletBalance(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.points).toBe(500);
    });
    expect(walletApi.getBalance).toHaveBeenCalledTimes(1);
  });

  it("does not ask for transactions when only a snapshot is hydrated", async () => {
    useAuthStore.setState({ currentUser: customer });

    const { result } = renderHook(() => useWalletTransactions(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.fetchStatus).toBe("idle");
    });
    expect(walletApi.getTransactions).not.toHaveBeenCalled();
  });

  it("fetches transactions once the token exists", async () => {
    vi.mocked(walletApi.getTransactions).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    useAuthStore.setState({ currentUser: customer, accessToken: "token" });

    const { result } = renderHook(() => useWalletTransactions(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.total).toBe(0);
    });
    expect(walletApi.getTransactions).toHaveBeenCalledTimes(1);
  });
});

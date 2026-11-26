import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAdminWalletAdjust } from "../useAdminWalletAdjust.hook";

const searchUsers = vi.fn();
const adjust = vi.fn();

vi.mock("../../../api/wallet/walletAdmin.api", () => ({
  walletAdminApi: {
    searchUsers: (...args: unknown[]) => searchUsers(...args),
    adjust: (...args: unknown[]) => adjust(...args),
  },
}));

const priya = {
  id: "11111111-2222-3333-4444-555555555555",
  name: "Priya Shah",
  email: "priya@example.com",
  status: "ACTIVE",
};

beforeEach(() => {
  searchUsers.mockReset().mockResolvedValue([priya]);
  adjust.mockReset().mockResolvedValue({
    ledgerId: "l1",
    balance: 750,
    purchasedBalance: 0,
    promotionalBalance: 750,
  });
});

describe("wallet adjustment: finding the account", () => {
  it("does not call the API for fewer than 3 characters (it would only be refused)", async () => {
    const { result } = renderHook(() => useAdminWalletAdjust());
    for (const search of [undefined, "", "  ", "ab", " p "]) {
      const page = await result.current.fetchUsers({
        page: 1,
        limit: 10,
        search,
      });
      expect(page.items).toEqual([]);
    }
    expect(searchUsers).not.toHaveBeenCalled();
  });

  it("searches with the trimmed term and shows name and email", async () => {
    const { result } = renderHook(() => useAdminWalletAdjust());
    const page = await result.current.fetchUsers({
      page: 1,
      limit: 10,
      search: "  priya  ",
    });
    expect(searchUsers).toHaveBeenCalledWith("priya");
    expect(page).toEqual({
      items: [
        { id: priya.id, label: "Priya Shah", sublabel: "priya@example.com" },
      ],
      page: 1,
      totalPages: 1,
      total: 1,
    });
  });

  it("flags a blocked account in the list so it is not adjusted by mistake", async () => {
    searchUsers.mockResolvedValue([{ ...priya, status: "BLOCKED" }]);
    const { result } = renderHook(() => useAdminWalletAdjust());
    const page = await result.current.fetchUsers({
      page: 1,
      limit: 10,
      search: "priya",
    });
    expect(page.items[0]?.sublabel).toBe("priya@example.com · BLOCKED");
  });

  it("falls back to the email when an account has no name", async () => {
    searchUsers.mockResolvedValue([{ ...priya, name: "" }]);
    const { result } = renderHook(() => useAdminWalletAdjust());
    const page = await result.current.fetchUsers({
      page: 1,
      limit: 10,
      search: "priya",
    });
    expect(page.items[0]?.label).toBe("priya@example.com");
  });
});

describe("wallet adjustment: the chosen account is the one adjusted", () => {
  it("submits the selected account's id with the amount and reason", async () => {
    const { result } = renderHook(() => useAdminWalletAdjust());
    act(() => {
      result.current.handleUserChange(priya.id);
      result.current.setAmount(500);
      result.current.setReason("Goodwill for a delayed order");
    });
    await act(async () => {
      await result.current.submit();
    });
    expect(adjust).toHaveBeenCalledWith(priya.id, {
      direction: "CREDIT",
      amount: 500,
      reason: "Goodwill for a delayed order",
      pointSource: "PROMOTIONAL",
    });
    await waitFor(() => expect(result.current.message).toContain("750"));
  });

  it("refuses to submit until an account is chosen, and calls nothing", async () => {
    const { result } = renderHook(() => useAdminWalletAdjust());
    act(() => {
      result.current.setAmount(500);
      result.current.setReason("Goodwill");
    });
    await act(async () => {
      await result.current.submit();
    });
    expect(adjust).not.toHaveBeenCalled();
    expect(result.current.error).toBeTruthy();
  });
});

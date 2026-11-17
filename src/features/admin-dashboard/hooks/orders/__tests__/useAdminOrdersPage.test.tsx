import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAdminOrdersPage } from "../useAdminOrdersPage";
import { ordersApi } from "@/features/orders";

const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => "/admin/orders",
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/features/orders", () => ({
  ordersApi: {
    myOrders: vi
      .fn()
      .mockResolvedValue({ items: [], total: 0, page: 1, totalPages: 1 }),
    updateStatus: vi.fn().mockResolvedValue({ message: "Updated" }),
    cancel: vi.fn().mockResolvedValue({ orderId: "1", cancelled: true }),
  },
}));

describe("useAdminOrdersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("initializes with empty filters and does NOT call update/replace in an infinite loop", async () => {
    const { result } = renderHook(() => useAdminOrdersPage());

    expect(result.current.filters.search).toBe("");
    expect(result.current.filters.status).toBe("");

    // Initial render should not call router.replace because URL is already empty
    expect(mockReplace).not.toHaveBeenCalled();

    // Calling load returns data
    await result.current.load({ page: 1, limit: 10 });
    expect(ordersApi.myOrders).toHaveBeenCalledTimes(1);
    expect(ordersApi.myOrders).toHaveBeenCalledWith(1, 10, undefined, {
      search: undefined,
      status: undefined,
    });
  });

  it("updates search and status and syncs to URL only once when changed", async () => {
    const { result } = renderHook(() => useAdminOrdersPage());

    act(() => {
      result.current.filters.onStatusChange("PENDING");
    });

    expect(result.current.filters.status).toBe("PENDING");

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/orders?status=PENDING", {
        scroll: false,
      });
    });

    // Should only have called replace once
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });

  it("clears filters properly and resets URL", async () => {
    mockSearchParams = new URLSearchParams("search=test&status=PENDING");
    const { result } = renderHook(() => useAdminOrdersPage());

    expect(result.current.filters.search).toBe("test");
    expect(result.current.filters.status).toBe("PENDING");

    act(() => {
      result.current.filters.onClear();
    });

    expect(result.current.filters.search).toBe("");
    expect(result.current.filters.status).toBe("");

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/orders", {
        scroll: false,
      });
    });
  });
});

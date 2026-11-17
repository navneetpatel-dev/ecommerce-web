import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminOrdersPage } from "../AdminOrdersPage.page";
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

vi.mock("@/shared/components/system/RequirePermission.component", () => ({
  RequirePermission: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/features/orders", () => ({
  ordersApi: {
    myOrders: vi.fn().mockResolvedValue({
      items: [
        {
          id: "ORD-001",
          status: "PENDING",
          total: 100,
          paymentMethod: "CASH_ON_DELIVERY",
          paymentStatus: "PENDING",
          createdAt: "2026-11-17T00:00:00.000Z",
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    }),
    updateStatus: vi.fn().mockResolvedValue({ message: "Updated" }),
    cancel: vi.fn().mockResolvedValue({ orderId: "ord-1", cancelled: true }),
  },
}));

describe("AdminOrdersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("renders orders table and calls ordersApi.myOrders exactly once on mount", async () => {
    render(<AdminOrdersPage />);

    await waitFor(() => {
      expect(screen.getAllByText(/pending/i).length).toBeGreaterThanOrEqual(1);
    });

    // Verify ordersApi.myOrders was called exactly once on mount (no infinite loops)
    expect(ordersApi.myOrders).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

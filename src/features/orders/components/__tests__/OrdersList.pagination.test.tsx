import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Order } from "@/shared/api/types";
import { OrdersList } from "../OrdersList.component";

vi.mock("@/features/reports", () => ({
  reportsEngineApi: { customerOrderHistoryExport: vi.fn() },
  CustomerOrderHistoryPanel: () => null,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

const order = {
  id: "order-1",
  userId: "user-1",
  totalAmount: 100,
  discountTotal: 0,
  status: "CONFIRMED",
  paymentStatus: "PAID",
  createdAt: "2026-09-03T08:05:09.000Z",
  subOrders: [],
} as Order;

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("OrdersList pagination", () => {
  it("renders shared controls and requests the next server page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <OrdersList
        orders={[order]}
        pagination={{
          currentPage: 2,
          totalPages: 3,
          total: 25,
          from: 11,
          to: 20,
          onPageChange,
        }}
      />,
    );

    expect(screen.getByText("Showing 11–20 of 25")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("keeps disabled pagination visible for a single page", () => {
    render(
      <OrdersList
        orders={[order]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          total: 1,
          from: 1,
          to: 1,
          onPageChange: vi.fn(),
        }}
      />,
    );

    expect(screen.getByText("Showing 1–1 of 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });
});

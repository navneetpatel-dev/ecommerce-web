import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { CurrentUser } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { AdminVendorFilterSelect } from "../AdminVendorFilterSelect.component";

const adminVendors = vi.fn();
const directory = vi.fn();

vi.mock("../../../api/analytics/admin.api", () => ({
  adminApi: { vendors: (...args: unknown[]) => adminVendors(...args) },
}));
vi.mock("@/features/vendors", () => ({
  vendorsApi: { directory: (...args: unknown[]) => directory(...args) },
}));
vi.mock("@/shared/api/client/client", () => ({
  apiClient: { get: vi.fn() },
}));

function signIn(role: CurrentUser["role"], permissions: string[]) {
  useAuthStore.setState({
    accessToken: "t",
    currentUser: {
      id: "u1",
      email: "u@example.com",
      name: "U",
      phone: null,
      role,
      permissions,
      vendorId: null,
      emailVerified: true,
    },
  });
}

function renderSelect() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <AdminVendorFilterSelect value="" onChange={vi.fn()} />
    </QueryClientProvider>,
  );
}

beforeAll(() => {
  // The list uses an IntersectionObserver for infinite scroll; jsdom has none.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
});

beforeEach(() => {
  adminVendors.mockReset().mockResolvedValue({
    items: [{ id: "v1", businessName: "Acme Traders", slug: "acme" }],
    page: 1,
    totalPages: 1,
    total: 1,
  });
  directory.mockReset().mockResolvedValue({
    items: [{ id: "v2", businessName: "Bright Goods Directory" }],
    page: 1,
    totalPages: 1,
    total: 1,
  });
  useAuthStore.setState({ accessToken: null, currentUser: null });
});

describe("AdminVendorFilterSelect, as the user sees it", () => {
  it("lists vendors, with details, for the Super Admin", async () => {
    signIn("SUPER_ADMIN", []);
    renderSelect();
    await userEvent.click(screen.getByRole("button", { name: /All Vendors/ }));
    expect(await screen.findByText("Acme Traders")).toBeVisible();
    expect(adminVendors).toHaveBeenCalled();
    expect(directory).not.toHaveBeenCalled();
  });
});

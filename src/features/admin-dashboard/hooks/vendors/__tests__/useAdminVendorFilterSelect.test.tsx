import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { CurrentUser } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useAdminVendorFilterSelect } from "../useAdminVendorFilterSelect.hook";

const adminVendors = vi.fn();
const directory = vi.fn();
const apiGet = vi.fn();

vi.mock("../../../api/analytics/admin.api", () => ({
  adminApi: { vendors: (...args: unknown[]) => adminVendors(...args) },
}));
vi.mock("@/features/vendors", () => ({
  vendorsApi: { directory: (...args: unknown[]) => directory(...args) },
}));
vi.mock("@/shared/api/client/client", () => ({
  apiClient: { get: (...args: unknown[]) => apiGet(...args) },
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

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const adminPage = {
  items: [
    {
      id: "v1",
      businessName: "Acme Traders",
      slug: "acme",
      state: "Gujarat",
    },
  ],
  page: 1,
  totalPages: 2,
  total: 30,
};
const directoryPage = {
  items: [{ id: "v2", businessName: "Bright Goods" }],
  page: 1,
  totalPages: 1,
  total: 1,
};

beforeEach(() => {
  adminVendors.mockReset().mockResolvedValue(adminPage);
  directory.mockReset().mockResolvedValue(directoryPage);
  apiGet.mockReset();
  useAuthStore.setState({ accessToken: null, currentUser: null });
});

describe("useAdminVendorFilterSelect: which list a role's dropdown uses", () => {
  // The page cache is shared across calls, so each case searches for its own term.
  it.each([
    ["Super Admin", "SUPER_ADMIN", []],
    ["a vendor manager", "ADMIN_CATALOG_MANAGER", ["vendor.manage"]],
    ["a vendor approver", "ADMIN_CATALOG_MANAGER", ["vendor.approve"]],
  ] as const)(
    "%s browses the full admin list (any status, with details)",
    async (_label, role, permissions) => {
      signIn(role, [...permissions]);
      const { result } = renderHook(
        () => useAdminVendorFilterSelect({ value: "" }),
        { wrapper },
      );
      const page = await result.current.fetchPage({
        page: 1,
        limit: 25,
        search: `acm ${_label}`,
      });
      expect(adminVendors).toHaveBeenCalledWith({
        page: 1,
        limit: 25,
        search: `acm ${_label}`,
        status: undefined,
      });
      expect(directory).not.toHaveBeenCalled();
      expect(page.items[0]).toEqual({
        id: "v1",
        label: "Acme Traders",
        sublabel: "@acme · Gujarat · #v1",
      });
      expect(page.totalPages).toBe(2);
      expect(result.current.resetKey).toBe("admin");
    },
  );

  it.each([
    ["Catalog Manager", "ADMIN_CATALOG_MANAGER", ["product.manage"]],
    ["Order Manager", "ADMIN_ORDER_MANAGER", ["order.manage"]],
    ["Finance Manager", "ADMIN_FINANCE_MANAGER", ["payout.manage"]],
  ] as const)(
    "regression: %s uses the approved-vendor directory, never the admin list that refuses them",
    async (_label, role, permissions) => {
      signIn(role, [...permissions]);
      const { result } = renderHook(
        () => useAdminVendorFilterSelect({ value: "" }),
        { wrapper },
      );
      const page = await result.current.fetchPage({
        page: 2,
        limit: 25,
        search: `brig ${_label}`,
      });
      expect(directory).toHaveBeenCalledWith({
        page: 2,
        limit: 25,
        search: `brig ${_label}`,
      });
      expect(adminVendors).not.toHaveBeenCalled();
      expect(page.items).toEqual([{ id: "v2", label: "Bright Goods" }]);
      expect(result.current.resetKey).toBe("directory");
    },
  );

  it("does not mix cached pages between the two sources", async () => {
    signIn("SUPER_ADMIN", []);
    const first = renderHook(() => useAdminVendorFilterSelect({ value: "" }), {
      wrapper,
    });
    await first.result.current.fetchPage({ page: 1, limit: 25 });
    signIn("ADMIN_CATALOG_MANAGER", ["product.manage"]);
    const second = renderHook(() => useAdminVendorFilterSelect({ value: "" }), {
      wrapper,
    });
    const page = await second.result.current.fetchPage({ page: 1, limit: 25 });
    expect(page.items[0]?.id).toBe("v2");
  });
});

describe("useAdminVendorFilterSelect: the name of an already-selected vendor", () => {
  it("a vendor manager reads the vendor's detail", async () => {
    signIn("SUPER_ADMIN", []);
    apiGet.mockResolvedValue({
      id: "v1",
      businessName: "Acme Traders",
      slug: "acme",
      state: "Gujarat",
    });
    const { result } = renderHook(
      () => useAdminVendorFilterSelect({ value: "v1" }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.pinnedOption).not.toBeNull());
    expect(result.current.pinnedOption?.label).toBe("Acme Traders");
    expect(directory).not.toHaveBeenCalled();
  });

  it("a role without vendor permissions resolves the name through the directory by id", async () => {
    signIn("ADMIN_CATALOG_MANAGER", ["product.manage"]);
    directory.mockResolvedValue(directoryPage);
    const { result } = renderHook(
      () => useAdminVendorFilterSelect({ value: "v2" }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.pinnedOption).not.toBeNull());
    expect(directory).toHaveBeenCalledWith({ id: "v2", page: 1, limit: 1 });
    expect(apiGet).not.toHaveBeenCalled();
    expect(result.current.pinnedOption).toEqual({
      id: "v2",
      label: "Bright Goods",
    });
  });

  it("an id that is not in the directory pins nothing instead of failing", async () => {
    signIn("ADMIN_CATALOG_MANAGER", ["product.manage"]);
    directory.mockResolvedValue({
      items: [],
      page: 1,
      totalPages: 1,
      total: 0,
    });
    const { result } = renderHook(
      () => useAdminVendorFilterSelect({ value: "gone" }),
      { wrapper },
    );
    await waitFor(() => expect(directory).toHaveBeenCalled());
    expect(result.current.pinnedOption).toBeNull();
  });

  it("makes no lookup when nothing is selected", () => {
    signIn("ADMIN_CATALOG_MANAGER", ["product.manage"]);
    renderHook(() => useAdminVendorFilterSelect({ value: "" }), { wrapper });
    expect(directory).not.toHaveBeenCalled();
    expect(apiGet).not.toHaveBeenCalled();
  });

  it("passes a chosen vendor up to the page's filter", () => {
    signIn("ADMIN_CATALOG_MANAGER", ["product.manage"]);
    const onChange = vi.fn();
    const { result } = renderHook(
      () => useAdminVendorFilterSelect({ value: "", onChange }),
      { wrapper },
    );
    result.current.handleChange("v2");
    expect(onChange).toHaveBeenCalledWith("v2");
  });

  it("a picker for approved vendors uses the light directory for everyone, even Super Admin", async () => {
    signIn("SUPER_ADMIN", []);
    const { result } = renderHook(
      () => useAdminVendorFilterSelect({ value: "", status: "APPROVED" }),
      { wrapper },
    );
    await result.current.fetchPage({
      page: 1,
      limit: 25,
      search: "picker term",
    });
    expect(directory).toHaveBeenCalledWith({
      page: 1,
      limit: 25,
      search: "picker term",
    });
    expect(adminVendors).not.toHaveBeenCalled();
    expect(result.current.resetKey).toBe("directory");
  });

  it("a fetched page is reused for a minute, then fetched again so new vendors appear", async () => {
    vi.useFakeTimers();
    try {
      signIn("ADMIN_CATALOG_MANAGER", ["product.manage"]);
      const { result } = renderHook(
        () => useAdminVendorFilterSelect({ value: "" }),
        { wrapper },
      );
      const query = { page: 1, limit: 25, search: "ttl term" };
      await result.current.fetchPage(query);
      await result.current.fetchPage(query);
      expect(directory).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(61 * 1000);
      await result.current.fetchPage(query);
      expect(directory).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});

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

describe("useAdminVendorFilterSelect: which list the dropdown uses", () => {
  it("a filter browses the full admin list (any status, with details)", async () => {
    signIn("SUPER_ADMIN", []);
    const { result } = renderHook(
      () => useAdminVendorFilterSelect({ value: "" }),
      { wrapper },
    );
    const page = await result.current.fetchPage({
      page: 1,
      limit: 25,
      search: "acm",
    });
    expect(adminVendors).toHaveBeenCalledWith({
      page: 1,
      limit: 25,
      search: "acm",
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
  });

  it("does not mix cached pages between the two sources", async () => {
    signIn("SUPER_ADMIN", []);
    const first = renderHook(() => useAdminVendorFilterSelect({ value: "" }), {
      wrapper,
    });
    await first.result.current.fetchPage({ page: 1, limit: 25 });
    const second = renderHook(
      () => useAdminVendorFilterSelect({ value: "", status: "APPROVED" }),
      { wrapper },
    );
    const page = await second.result.current.fetchPage({ page: 1, limit: 25 });
    expect(page.items[0]?.id).toBe("v2");
  });
});

describe("useAdminVendorFilterSelect: the name of an already-selected vendor", () => {
  it("a filter reads the vendor's detail", async () => {
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

  it("an approved-vendor picker resolves the name through the directory by id", async () => {
    signIn("SUPER_ADMIN", []);
    directory.mockResolvedValue(directoryPage);
    const { result } = renderHook(
      () => useAdminVendorFilterSelect({ value: "v2", status: "APPROVED" }),
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
    signIn("SUPER_ADMIN", []);
    directory.mockResolvedValue({
      items: [],
      page: 1,
      totalPages: 1,
      total: 0,
    });
    const { result } = renderHook(
      () => useAdminVendorFilterSelect({ value: "gone", status: "APPROVED" }),
      { wrapper },
    );
    await waitFor(() => expect(directory).toHaveBeenCalled());
    expect(result.current.pinnedOption).toBeNull();
  });

  it("makes no lookup when nothing is selected", () => {
    signIn("SUPER_ADMIN", []);
    renderHook(() => useAdminVendorFilterSelect({ value: "" }), { wrapper });
    expect(directory).not.toHaveBeenCalled();
    expect(apiGet).not.toHaveBeenCalled();
  });

  it("passes a chosen vendor up to the page's filter", () => {
    signIn("SUPER_ADMIN", []);
    const onChange = vi.fn();
    const { result } = renderHook(
      () => useAdminVendorFilterSelect({ value: "", onChange }),
      { wrapper },
    );
    result.current.handleChange("v2");
    expect(onChange).toHaveBeenCalledWith("v2");
  });

  it("a picker for approved vendors uses the light directory", async () => {
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
      signIn("SUPER_ADMIN", []);
      const { result } = renderHook(
        () => useAdminVendorFilterSelect({ value: "", status: "APPROVED" }),
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

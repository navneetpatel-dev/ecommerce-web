import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useAdminVendorFilterSelect } from "../useAdminVendorFilterSelect.hook";
import {
  signIn,
  wrapper,
  adminPage,
  directoryPage,
} from "./vendorFilterSelect.fixtures";

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

import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
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

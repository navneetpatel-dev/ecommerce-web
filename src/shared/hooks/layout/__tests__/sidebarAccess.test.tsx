import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { CurrentUser } from "@/shared/api/types";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useAdminLayout } from "../useAdminLayout.hook";
import { useVendorLayout } from "../useVendorLayout.hook";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

/** Mirrors backend `ROLE_PERMISSIONS` (core/permissions/permissionKeys.ts). Keep in sync. */
const VENDOR = [
  "product.create",
  "product.update",
  "product.delete",
  "suborder.manage",
  "payout.view",
  "review.respond",
];

function signIn(
  role: CurrentUser["role"],
  permissions: string[],
  vendorId: string | null = null,
) {
  useAuthStore.setState({
    accessToken: "t",
    currentUser: {
      id: "u1",
      email: "u@example.com",
      name: "U",
      phone: null,
      role,
      permissions,
      vendorId,
      emailVerified: true,
    },
  });
}

const adminHrefs = () =>
  renderHook(() => useAdminLayout()).result.current.navItems.map((i) => i.href);
const vendorHrefs = () =>
  renderHook(() => useVendorLayout()).result.current.navItems.map(
    (i) => i.href,
  );

const A = PATHS.admin;
const V = PATHS.vendor;

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, currentUser: null });
});

describe("admin sidebar by role", () => {
  it("Super Admin sees all 24 items", () => {
    signIn("SUPER_ADMIN", []);
    expect(adminHrefs()).toHaveLength(24);
    expect(adminHrefs()).toEqual(
      expect.arrayContaining([
        A.webVitals,
        A.cashbackOffers,
        A.giftCards,
        A.finance,
        A.audit,
        A.bugReports,
      ]),
    );
  });

  it.each([
    ["VENDOR_OWNER", VENDOR],
    ["CUSTOMER", []],
  ] as const)("%s sees no admin items", (role, perms) => {
    signIn(role, [...perms], role === "CUSTOMER" ? null : "v1");
    expect(adminHrefs()).toEqual([]);
  });

  it("signed-out visitors see nothing", () => {
    expect(adminHrefs()).toEqual([]);
  });
});

describe("vendor sidebar by role", () => {
  it("Vendor sees all 13 items", () => {
    signIn("VENDOR_OWNER", VENDOR, "v1");
    expect(vendorHrefs().sort()).toEqual(
      [
        V.overview,
        V.products,
        V.orders,
        V.returns,
        V.payouts,
        V.analytics,
        V.reports,
        V.coupons,
        V.reviews,
        V.productQna,
        V.supportTickets,
        V.bugReports,
        V.shopSettings,
      ].sort(),
    );
  });

  it("Super Admin without a store sees no vendor items", () => {
    signIn("SUPER_ADMIN", []);
    const { result } = renderHook(() => useVendorLayout());
    expect(result.current.navItems).toEqual([]);
    expect(result.current.hasVendorAccess).toBe(false);
  });

  it("Super Admin impersonating a vendor sees the vendor sidebar", () => {
    signIn("VENDOR_OWNER", VENDOR, "v1");
    useAuthStore.setState((s) => ({
      currentUser: { ...s.currentUser!, impersonatedBy: "admin-1" },
    }));
    expect(vendorHrefs()).toHaveLength(13);
  });

  it("Customer sees no vendor items", () => {
    signIn("CUSTOMER", []);
    expect(vendorHrefs()).toEqual([]);
  });
});

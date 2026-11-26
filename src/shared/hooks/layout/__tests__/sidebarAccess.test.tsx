import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { CurrentUser } from "@/shared/api/types";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useAdminLayout } from "../useAdminLayout.hook";
import { useVendorLayout } from "../useVendorLayout.hook";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

/** Mirrors backend `ROLE_PERMISSIONS` (core/permissions/permissionKeys.ts). Keep in sync. */
const ORDER_MANAGER = [
  "order.manage",
  "suborder.manage",
  "order.refund",
  "shipping.manage",
  "analytics.view",
  "ticket.manage",
];
const FINANCE_MANAGER = [
  "payout.manage",
  "commission.view",
  "analytics.view",
  "analytics.revenue",
  "wallet.adjust",
  "cashback.manage",
  "gift_card.manage",
];
const CATALOG_MANAGER = [
  "product.manage",
  "product.create",
  "product.approve",
  "category.manage",
  "coupon.manage",
  "banner.manage",
  "review.moderate",
  "analytics.view",
];
const VENDOR_OWNER = [
  "product.create",
  "product.update",
  "product.delete",
  "suborder.manage",
  "payout.view",
  "review.respond",
  "team.manage",
];
const VENDOR_STAFF = ["product.update", "suborder.manage"];

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
  it("Super Admin sees all 25 items", () => {
    signIn("SUPER_ADMIN", []);
    expect(adminHrefs()).toHaveLength(25);
  });

  it("Order Manager sees exactly its 6 operations items (no Audit, Bug Reports, Web Vitals or Gift Cards)", () => {
    signIn("ADMIN_ORDER_MANAGER", ORDER_MANAGER);
    expect(adminHrefs().sort()).toEqual(
      [
        A.analytics,
        A.reports,
        A.orders,
        A.returns,
        A.shipping,
        A.supportTickets,
      ].sort(),
    );
  });

  it("Finance Manager sees exactly its 5 money items", () => {
    signIn("ADMIN_FINANCE_MANAGER", FINANCE_MANAGER);
    expect(adminHrefs().sort()).toEqual(
      [A.analytics, A.reports, A.finance, A.giftCards, A.cashbackOffers].sort(),
    );
  });

  it("Finance Manager gets no operations, catalog, user or system pages", () => {
    signIn("ADMIN_FINANCE_MANAGER", FINANCE_MANAGER);
    const hrefs = adminHrefs();
    for (const other of [
      A.orders,
      A.returns,
      A.shipping,
      A.supportTickets,
      A.bugReports,
      A.products,
      A.inventory,
      A.categories,
      A.tax,
      A.coupons,
      A.banners,
      A.reviews,
      A.qna,
      A.vendors,
      A.users,
      A.roles,
      A.audit,
      A.settings,
      A.notifications,
      A.webVitals,
    ]) {
      expect(hrefs).not.toContain(other);
    }
  });

  it("only Super Admin and the Finance Manager see Gift Cards, Finance & Payouts and Cashback Offers", () => {
    for (const [role, perms] of [
      ["ADMIN_ORDER_MANAGER", ORDER_MANAGER],
      ["ADMIN_CATALOG_MANAGER", CATALOG_MANAGER],
    ] as const) {
      signIn(role, [...perms]);
      const hrefs = adminHrefs();
      expect(hrefs).not.toContain(A.giftCards);
      expect(hrefs).not.toContain(A.finance);
      expect(hrefs).not.toContain(A.cashbackOffers);
    }
    signIn("ADMIN_FINANCE_MANAGER", FINANCE_MANAGER);
    expect(adminHrefs()).toEqual(
      expect.arrayContaining([A.giftCards, A.finance, A.cashbackOffers]),
    );
  });

  it("Catalog Manager sees exactly its 9 catalog/marketing items (no Audit, Web Vitals or Cashback Offers)", () => {
    signIn("ADMIN_CATALOG_MANAGER", CATALOG_MANAGER);
    expect(adminHrefs().sort()).toEqual(
      [
        A.analytics,
        A.reports,
        A.products,
        A.inventory,
        A.categories,
        A.coupons,
        A.banners,
        A.reviews,
        A.qna,
      ].sort(),
    );
  });

  it("only Super Admin sees Web Vitals and Cashback Offers", () => {
    signIn("SUPER_ADMIN", []);
    expect(adminHrefs()).toContain(A.webVitals);
    expect(adminHrefs()).toContain(A.cashbackOffers);
    for (const [role, perms] of [
      ["ADMIN_ORDER_MANAGER", ORDER_MANAGER],
      ["ADMIN_CATALOG_MANAGER", CATALOG_MANAGER],
    ] as const) {
      signIn(role, [...perms]);
      expect(adminHrefs()).not.toContain(A.webVitals);
      expect(adminHrefs()).not.toContain(A.cashbackOffers);
    }
  });

  it("analytics.view no longer opens Web Vitals, and coupon.manage no longer opens Cashback Offers", () => {
    signIn("ADMIN_ORDER_MANAGER", ["analytics.view"]);
    expect(adminHrefs()).toContain(A.analytics);
    expect(adminHrefs()).not.toContain(A.webVitals);
    signIn("ADMIN_CATALOG_MANAGER", ["coupon.manage"]);
    expect(adminHrefs()).toContain(A.coupons);
    expect(adminHrefs()).not.toContain(A.cashbackOffers);
    signIn("ADMIN_CATALOG_MANAGER", ["webvitals.view", "cashback.manage"]);
    expect(adminHrefs()).toContain(A.webVitals);
    expect(adminHrefs()).toContain(A.cashbackOffers);
  });

  it("only Super Admin sees Bug Reports", () => {
    signIn("SUPER_ADMIN", []);
    expect(adminHrefs()).toContain(A.bugReports);
    signIn("ADMIN_ORDER_MANAGER", ORDER_MANAGER);
    expect(adminHrefs()).not.toContain(A.bugReports);
    expect(adminHrefs()).toContain(A.supportTickets);
    signIn("ADMIN_CATALOG_MANAGER", CATALOG_MANAGER);
    expect(adminHrefs()).not.toContain(A.bugReports);
    signIn("ADMIN_ORDER_MANAGER", [...ORDER_MANAGER, "bug_report.manage"]);
    expect(adminHrefs()).toContain(A.bugReports);
  });

  it("only Super Admin sees Audit", () => {
    signIn("SUPER_ADMIN", []);
    expect(adminHrefs()).toContain(A.audit);
    signIn("ADMIN_ORDER_MANAGER", ORDER_MANAGER);
    expect(adminHrefs()).not.toContain(A.audit);
    signIn("ADMIN_CATALOG_MANAGER", CATALOG_MANAGER);
    expect(adminHrefs()).not.toContain(A.audit);
    signIn("ADMIN_ORDER_MANAGER", [...ORDER_MANAGER, "audit.view"]);
    expect(adminHrefs()).toContain(A.audit);
  });

  it.each([
    ["VENDOR_OWNER", VENDOR_OWNER],
    ["VENDOR_STAFF", VENDOR_STAFF],
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
  it("Vendor Owner sees all 14 items", () => {
    signIn("VENDOR_OWNER", VENDOR_OWNER, "v1");
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
        V.team,
      ].sort(),
    );
  });

  it("Vendor Staff sees 7 items and no owner-only pages", () => {
    signIn("VENDOR_STAFF", VENDOR_STAFF, "v1");
    const hrefs = vendorHrefs();
    expect(hrefs.sort()).toEqual(
      [
        V.overview,
        V.products,
        V.orders,
        V.returns,
        V.reports,
        V.supportTickets,
        V.bugReports,
      ].sort(),
    );
    for (const ownerOnly of [
      V.coupons,
      V.shopSettings,
      V.payouts,
      V.analytics,
      V.team,
      V.reviews,
      V.productQna,
    ]) {
      expect(hrefs).not.toContain(ownerOnly);
    }
  });

  it("payout.view without team.manage does not show Team", () => {
    signIn("VENDOR_OWNER", ["payout.view", "suborder.manage"], "v1");
    const hrefs = vendorHrefs();
    expect(hrefs).toContain(V.payouts);
    expect(hrefs).not.toContain(V.team);
  });

  it("team.manage alone shows only Team", () => {
    signIn("VENDOR_OWNER", ["team.manage"], "v1");
    expect(vendorHrefs()).toEqual([V.team]);
  });

  it("Order Manager (suborder.manage, no store) sees no vendor items", () => {
    signIn("ADMIN_ORDER_MANAGER", ORDER_MANAGER);
    const { result } = renderHook(() => useVendorLayout());
    expect(result.current.navItems).toEqual([]);
    expect(result.current.hasVendorAccess).toBe(false);
  });

  it("Catalog Manager (product.create, no store) sees no vendor items", () => {
    signIn("ADMIN_CATALOG_MANAGER", CATALOG_MANAGER);
    expect(vendorHrefs()).toEqual([]);
  });

  it("Super Admin without a store sees no vendor items", () => {
    signIn("SUPER_ADMIN", []);
    expect(vendorHrefs()).toEqual([]);
  });

  it("Super Admin impersonating a vendor owner sees the owner sidebar", () => {
    signIn("VENDOR_OWNER", VENDOR_OWNER, "v1");
    useAuthStore.setState((s) => ({
      currentUser: { ...s.currentUser!, impersonatedBy: "admin-1" },
    }));
    expect(vendorHrefs()).toHaveLength(14);
  });

  it("Finance Manager (no store) sees no vendor items", () => {
    signIn("ADMIN_FINANCE_MANAGER", FINANCE_MANAGER);
    expect(vendorHrefs()).toEqual([]);
  });

  it("Customer sees no vendor items", () => {
    signIn("CUSTOMER", []);
    expect(vendorHrefs()).toEqual([]);
  });
});

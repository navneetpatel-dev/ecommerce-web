import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CurrentUser } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { AdminLayoutContainer } from "../AdminLayoutContainer.container";

let mockPath = "/admin";
vi.mock("next/navigation", () => ({ usePathname: () => mockPath }));

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
      vendorId: role.startsWith("VENDOR") ? "v1" : null,
      emailVerified: true,
    },
  });
}

function renderAt(path: string) {
  mockPath = path;
  render(
    <AdminLayoutContainer renderHeader={() => <header />}>
      <div>PAGE BODY</div>
    </AdminLayoutContainer>,
  );
}

const denied = () => screen.queryByText(LABELS.accessDeniedHeading);
const body = () => screen.queryByText("PAGE BODY");

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, currentUser: null });
});

describe("AdminLayoutContainer access", () => {
  it.each([
    ["CUSTOMER", []],
    ["VENDOR_OWNER", ["product.create", "product.update", "payout.view"]],
    ["VENDOR_STAFF", ["product.update", "suborder.manage"]],
  ] as const)(
    "blocks %s on the admin root, profile and a deep page",
    (role, perms) => {
      for (const path of [
        PATHS.admin.root,
        PATHS.admin.profile,
        PATHS.admin.orders,
      ]) {
        signIn(role, [...perms]);
        renderAt(path);
        expect(denied()).toBeInTheDocument();
        expect(body()).not.toBeInTheDocument();
        document.body.innerHTML = "";
      }
    },
  );

  it("lets the Order Manager open the admin root, profile and its own pages", () => {
    const perms = ["order.manage", "suborder.manage", "analytics.view"];
    for (const path of [
      PATHS.admin.root,
      PATHS.admin.profile,
      PATHS.admin.orders,
    ]) {
      signIn("ADMIN_ORDER_MANAGER", perms);
      renderAt(path);
      expect(body()).toBeInTheDocument();
      expect(denied()).not.toBeInTheDocument();
      document.body.innerHTML = "";
    }
  });

  it("still blocks an admin manager from pages outside their permissions", () => {
    signIn("ADMIN_ORDER_MANAGER", ["order.manage"]);
    renderAt(PATHS.admin.users);
    expect(denied()).toBeInTheDocument();
    expect(body()).not.toBeInTheDocument();
  });

  it("blocks managers from Web Vitals and Cashback Offers even by direct URL, but not from their own pages", () => {
    signIn("ADMIN_ORDER_MANAGER", ["order.manage", "analytics.view"]);
    renderAt(PATHS.admin.webVitals);
    expect(denied()).toBeInTheDocument();
    expect(body()).not.toBeInTheDocument();
    document.body.innerHTML = "";

    signIn("ADMIN_CATALOG_MANAGER", ["coupon.manage", "analytics.view"]);
    renderAt(PATHS.admin.cashbackOffers);
    expect(denied()).toBeInTheDocument();
    expect(body()).not.toBeInTheDocument();
    document.body.innerHTML = "";

    renderAt(PATHS.admin.coupons);
    expect(body()).toBeInTheDocument();
    document.body.innerHTML = "";

    renderAt(PATHS.admin.analytics);
    expect(body()).toBeInTheDocument();
  });

  it("Gift Cards and Finance belong to the Finance Manager: the Order Manager is blocked by direct URL", () => {
    signIn("ADMIN_ORDER_MANAGER", ["order.manage", "analytics.view"]);
    renderAt(PATHS.admin.giftCards);
    expect(denied()).toBeInTheDocument();
    expect(body()).not.toBeInTheDocument();
    document.body.innerHTML = "";

    const finance = [
      "payout.manage",
      "commission.view",
      "analytics.view",
      "analytics.revenue",
      "wallet.adjust",
      "cashback.manage",
      "gift_card.manage",
    ];
    for (const path of [
      PATHS.admin.giftCards,
      PATHS.admin.finance,
      PATHS.admin.cashbackOffers,
      PATHS.admin.analytics,
    ]) {
      signIn("ADMIN_FINANCE_MANAGER", finance);
      renderAt(path);
      expect(body()).toBeInTheDocument();
      document.body.innerHTML = "";
    }

    signIn("ADMIN_FINANCE_MANAGER", finance);
    renderAt(PATHS.admin.orders);
    expect(denied()).toBeInTheDocument();
    expect(body()).not.toBeInTheDocument();
  });

  it("lets the Super Admin open Web Vitals and Cashback Offers", () => {
    signIn("SUPER_ADMIN", []);
    renderAt(PATHS.admin.webVitals);
    expect(body()).toBeInTheDocument();
    document.body.innerHTML = "";
    renderAt(PATHS.admin.cashbackOffers);
    expect(body()).toBeInTheDocument();
  });

  it("lets the Super Admin open any page", () => {
    signIn("SUPER_ADMIN", []);
    renderAt(PATHS.admin.roles);
    expect(body()).toBeInTheDocument();
  });

  it("keeps prior behaviour while the session is still loading (no flash of denial)", () => {
    renderAt(PATHS.admin.root);
    expect(body()).toBeInTheDocument();
    expect(denied()).not.toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CurrentUser } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { VendorLayoutContainer } from "../VendorLayoutContainer.container";

let mockPath = "/vendor/dashboard/orders";
vi.mock("next/navigation", () => ({ usePathname: () => mockPath }));

function signIn(
  role: CurrentUser["role"],
  permissions: string[],
  vendorId: string | null,
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

function renderAt(path: string) {
  mockPath = path;
  render(
    <VendorLayoutContainer renderHeader={() => <header />}>
      <div>PAGE BODY</div>
    </VendorLayoutContainer>,
  );
}

const denied = () => screen.queryByText(LABELS.accessDeniedHeading);
const body = () => screen.queryByText("PAGE BODY");

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, currentUser: null });
});

describe("VendorLayoutContainer access", () => {
  it("renders the page for a vendor owner", () => {
    signIn("VENDOR_OWNER", ["suborder.manage", "payout.view"], "v1");
    renderAt(PATHS.vendor.orders);
    expect(body()).toBeInTheDocument();
    expect(denied()).not.toBeInTheDocument();
  });

  it("blocks an admin with suborder.manage who has no store, even by direct URL", () => {
    signIn("ADMIN_ORDER_MANAGER", ["suborder.manage", "order.manage"], null);
    renderAt(PATHS.vendor.orders);
    expect(denied()).toBeInTheDocument();
    expect(body()).not.toBeInTheDocument();
  });

  it("blocks a catalog manager (product.create, no store) from vendor coupons", () => {
    signIn("ADMIN_CATALOG_MANAGER", ["product.create"], null);
    renderAt(PATHS.vendor.coupons);
    expect(denied()).toBeInTheDocument();
    expect(body()).not.toBeInTheDocument();
  });

  it.each([PATHS.vendor.coupons, PATHS.vendor.shopSettings, PATHS.vendor.team])(
    "blocks vendor staff from owner-only page %s",
    (path) => {
      signIn("VENDOR_STAFF", ["product.update", "suborder.manage"], "v1");
      renderAt(path);
      expect(denied()).toBeInTheDocument();
      expect(body()).not.toBeInTheDocument();
    },
  );

  it.each([PATHS.vendor.orders, PATHS.vendor.products, PATHS.vendor.reports])(
    "still lets vendor staff open %s",
    (path) => {
      signIn("VENDOR_STAFF", ["product.update", "suborder.manage"], "v1");
      renderAt(path);
      expect(body()).toBeInTheDocument();
      expect(denied()).not.toBeInTheDocument();
    },
  );

  it.each([PATHS.vendor.coupons, PATHS.vendor.shopSettings])(
    "lets the vendor owner open %s",
    (path) => {
      signIn(
        "VENDOR_OWNER",
        ["product.create", "product.update", "suborder.manage", "payout.view"],
        "v1",
      );
      renderAt(path);
      expect(body()).toBeInTheDocument();
    },
  );

  it("lets the vendor owner open Team, and blocks payout.view without team.manage", () => {
    signIn("VENDOR_OWNER", ["team.manage"], "v1");
    renderAt(PATHS.vendor.team);
    expect(body()).toBeInTheDocument();
    document.body.innerHTML = "";
    signIn("VENDOR_OWNER", ["payout.view"], "v1");
    renderAt(PATHS.vendor.team);
    expect(denied()).toBeInTheDocument();
    expect(body()).not.toBeInTheDocument();
  });

  it("keeps the vendor profile page reachable for any signed-in user", () => {
    signIn("CUSTOMER", [], null);
    renderAt(PATHS.vendor.profile);
    expect(body()).toBeInTheDocument();
  });
});

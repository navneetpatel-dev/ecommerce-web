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

  it("lets the Super Admin open the root, profile and every kind of page", () => {
    for (const path of [
      PATHS.admin.root,
      PATHS.admin.profile,
      PATHS.admin.orders,
      PATHS.admin.users,
      PATHS.admin.webVitals,
      PATHS.admin.cashbackOffers,
      PATHS.admin.giftCards,
      PATHS.admin.finance,
      PATHS.admin.audit,
    ]) {
      signIn("SUPER_ADMIN", []);
      renderAt(path);
      expect(body()).toBeInTheDocument();
      expect(denied()).not.toBeInTheDocument();
      document.body.innerHTML = "";
    }
  });

  it("keeps prior behaviour while the session is still loading (no flash of denial)", () => {
    renderAt(PATHS.admin.root);
    expect(body()).toBeInTheDocument();
    expect(denied()).not.toBeInTheDocument();
  });
});

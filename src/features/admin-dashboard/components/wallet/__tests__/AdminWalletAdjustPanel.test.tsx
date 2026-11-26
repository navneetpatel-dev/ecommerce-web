import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CurrentUser } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { AdminWalletAdjustPanel } from "../AdminWalletAdjustPanel.component";

vi.mock("../../../api/wallet/walletAdmin.api", () => ({
  walletAdminApi: { searchUsers: vi.fn(), adjust: vi.fn() },
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

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, currentUser: null });
});

describe("AdminWalletAdjustPanel", () => {
  it("offers an account picker, not a box to paste a raw user ID", () => {
    signIn("ADMIN_FINANCE_MANAGER", ["wallet.adjust"]);
    render(<AdminWalletAdjustPanel />);
    expect(screen.getByText(LABELS.walletAdjustUserId)).toBeInTheDocument();
    expect(
      screen.getByText(LABELS.walletAdjustUserPlaceholder),
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("e.g. usr_123456789"),
    ).not.toBeInTheDocument();
    expect(screen.getByText(LABELS.walletAdjustSubmit)).toBeInTheDocument();
  });

  it("shows nothing to someone without wallet.adjust", () => {
    signIn("ADMIN_ORDER_MANAGER", ["order.manage"]);
    render(<AdminWalletAdjustPanel />);
    expect(
      screen.queryByText(LABELS.walletAdjustSubmit),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(LABELS.walletAdjustUserId),
    ).not.toBeInTheDocument();
  });
});

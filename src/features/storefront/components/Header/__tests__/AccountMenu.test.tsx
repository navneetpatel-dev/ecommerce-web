import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import type { CurrentUser } from "@/shared/api/types";
import { AccountMenu } from "../AccountMenu.component";

const logout = vi.fn();
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/features/auth", () => ({
  useLogout: () => ({ mutate: logout, isPending: false }),
}));

const shopper = {
  id: "u1",
  name: "Asha Rao",
  email: "asha@example.com",
  role: "CUSTOMER",
} as unknown as CurrentUser;

describe("AccountMenu (B-05, B-06)", () => {
  it("stays open when a pointer hovers and then clicks the avatar", async () => {
    const user = userEvent.setup();
    render(<AccountMenu currentUser={shopper} />);
    const trigger = screen.getByRole("button", {
      name: LABELS.openAccountMenu,
    });
    await user.hover(trigger);
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("link", { name: LABELS.accountMenuOrders }),
    ).toBeVisible();
  });

  it("lists the shopper pages and signs out", async () => {
    const user = userEvent.setup();
    render(<AccountMenu currentUser={shopper} />);
    await user.click(
      screen.getByRole("button", { name: LABELS.openAccountMenu }),
    );
    for (const [name, href] of [
      [LABELS.accountMenuOrders, PATHS.orders],
      [LABELS.accountMenuReturns, PATHS.myReturns],
      [LABELS.accountMenuWallet, PATHS.wallet],
      [LABELS.accountMenuCashback, PATHS.walletCashback],
      [LABELS.accountMenuGiftCards, PATHS.giftCardsMine],
      [LABELS.accountMenuWishlist, PATHS.wishlist],
      [LABELS.accountMenuReviews, PATHS.reviews],
      [LABELS.accountMenuSupportTickets, PATHS.supportTickets],
      [LABELS.accountMenuBugReports, PATHS.bugReports],
    ] as const) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
    await user.click(screen.getByRole("button", { name: LABELS.signOut }));
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape and puts focus back on the avatar", async () => {
    const user = userEvent.setup();
    render(<AccountMenu currentUser={shopper} />);
    const trigger = screen.getByRole("button", {
      name: LABELS.openAccountMenu,
    });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});

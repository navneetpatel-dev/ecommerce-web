import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";

export interface AccountMenuLink {
  href: string;
  label: string;
}

export interface AccountMenuGroup {
  title: string;
  links: AccountMenuLink[];
}

/**
 * Shopper pages the desktop account menu leads to, above the profile sections.
 * Before, these were only reachable from Profile > Orders.
 */
export const SHOPPER_MENU_GROUPS: readonly AccountMenuGroup[] = [
  {
    title: LABELS.accountMenuShopping,
    links: [
      { href: PATHS.orders, label: LABELS.accountMenuOrders },
      { href: PATHS.myReturns, label: LABELS.accountMenuReturns },
      { href: PATHS.wishlist, label: LABELS.accountMenuWishlist },
      { href: PATHS.reviews, label: LABELS.accountMenuReviews },
      { href: PATHS.myQuestions, label: LABELS.accountMenuQuestions },
      { href: PATHS.myAnswers, label: LABELS.accountMenuAnswers },
    ],
  },
  {
    title: LABELS.accountMenuMoney,
    links: [
      { href: PATHS.wallet, label: LABELS.accountMenuWallet },
      { href: PATHS.walletCashback, label: LABELS.accountMenuCashback },
      { href: PATHS.giftCardsMine, label: LABELS.accountMenuGiftCards },
    ],
  },
  {
    title: LABELS.accountMenuHelp,
    links: [
      { href: PATHS.supportTickets, label: LABELS.accountMenuSupportTickets },
      { href: PATHS.bugReports, label: LABELS.accountMenuBugReports },
    ],
  },
];

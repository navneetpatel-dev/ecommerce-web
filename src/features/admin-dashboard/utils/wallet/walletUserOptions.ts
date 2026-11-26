import type {
  InfiniteSingleSelectOption,
  InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect";
import type { WalletUserMatch } from "../../api/wallet/walletAdmin.api";

/** The lookup asks for at least this many characters (the API rejects fewer). */
export const WALLET_USER_SEARCH_MIN = 3;

export const EMPTY_WALLET_USER_PAGE: InfiniteSingleSelectPageResult = {
  items: [],
  page: 1,
  totalPages: 1,
  total: 0,
};

/** "Priya Shah" under "priya@example.com", with the status when the account is not active. */
export function walletUserToOption(
  user: WalletUserMatch,
): InfiniteSingleSelectOption {
  const status = user.status === "ACTIVE" ? "" : ` · ${user.status}`;
  return {
    id: user.id,
    label: user.name || user.email,
    sublabel: `${user.email}${status}`,
  };
}

/** The API returns one capped page, so there is nothing further to scroll. */
export function walletUsersToPage(
  users: WalletUserMatch[],
): InfiniteSingleSelectPageResult {
  return {
    items: users.map(walletUserToOption),
    page: 1,
    totalPages: 1,
    total: users.length,
  };
}

import { apiClient } from "@/shared/api/client/client";
import { buildSearchParams } from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";

export type WalletAdjustBody = {
  direction: "CREDIT" | "DEBIT";
  amount: number;
  reason: string;
  pointSource?: "PURCHASED" | "PROMOTIONAL";
};

export type WalletAdjustResult = {
  ledgerId: string;
  balance: number;
  purchasedBalance: number;
  promotionalBalance: number;
};

/** What the lookup reveals about an account: enough to tell two people apart. */
export type WalletUserMatch = {
  id: string;
  name: string;
  email: string;
  status: string;
};

export const walletAdminApi = {
  /** Name, email or pasted user id (3+ characters); at most 10 matches. */
  searchUsers: (search: string) =>
    apiClient.get<WalletUserMatch[]>(
      API.walletAdmin.users(buildSearchParams({ search }).toString()),
    ),
  adjust: (userId: string, body: WalletAdjustBody) =>
    apiClient.post<WalletAdjustResult>(API.walletAdmin.adjust(userId), body),
};

import { apiClient } from "@/shared/api/client/client";
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

export const walletAdminApi = {
  adjust: (userId: string, body: WalletAdjustBody) =>
    apiClient.post<WalletAdjustResult>(API.walletAdmin.adjust(userId), body),
};

import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export type PublicPlatformSettings = {
  freeShippingThreshold: number;
  defaultReturnWindow: number;
  supportEmail: string;
  supportHours: string;
  ticketReopenWindowDays: number;
  bugVerifyWindowDays: number;
  bugCloseWindowDays: number;
  returnShippingFee: number;
  codEnabled: boolean;
  codMinOrderValue: number;
  codMaxOrderValue: number | null;
  walletRechargeEnabled: boolean;
  walletMinRechargeInr: number;
  walletMaxRechargeInr: number;
  walletMaxBalancePoints: number;
  walletRechargePresetsInr: number[];
  pointsPerRupee: number;
};

/** App-wide public platform settings — consumed across features via usePublicSettings. */
export const publicSettingsApi = {
  getPublic: () => apiClient.get<PublicPlatformSettings>(API.settings.public),
};

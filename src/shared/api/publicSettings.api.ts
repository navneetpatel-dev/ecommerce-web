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
  /** Maintenance mode (B-11): the storefront proxy sends shoppers to /maintenance while on. */
  maintenanceEnabled?: boolean;
  maintenanceMessage?: string;
  /** When the store expects to be back (ISO time), or null. */
  maintenanceUntil?: string | null;
  /** False when Google sign-in is not configured, so the button is hidden (C-03). */
  googleSignInEnabled?: boolean;
};

/** App-wide public platform settings — consumed across features via usePublicSettings. */
export const publicSettingsApi = {
  getPublic: () => apiClient.get<PublicPlatformSettings>(API.settings.public),
};

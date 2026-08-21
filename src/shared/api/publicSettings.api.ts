import { apiClient } from "@/shared/api/client";
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
};

/** App-wide public platform settings — consumed across features via usePublicSettings. */
export const publicSettingsApi = {
  getPublic: () => apiClient.get<PublicPlatformSettings>(API.settings.public),
};

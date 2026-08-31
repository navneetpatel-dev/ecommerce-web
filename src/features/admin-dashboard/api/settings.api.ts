import { apiClient } from "@/shared/api/client";
import { API } from "@/shared/constants/apiRoutes";
import { publicSettingsApi } from "@/shared/api/publicSettings.api";

export type { PublicPlatformSettings } from "@/shared/api/publicSettings.api";
import type { PublicPlatformSettings } from "@/shared/api/publicSettings.api";

export type AdminPlatformSettings = PublicPlatformSettings & {
  defaultCommissionRate: number;
  tcsRatePercent: number;
  tdsRatePercent: number;
  commissionGstRatePercent: number;
  platformGstin: string;
  platformLegalName: string;
  platformState: string;
  autoApproveProducts: boolean;
  payoutCycle: string;
  returnShippingFee: number;
};

export const settingsApi = {
  getPublic: publicSettingsApi.getPublic,
  get: () => apiClient.get<AdminPlatformSettings>(API.settings.root),
  update: (body: AdminPlatformSettings) =>
    apiClient.put<AdminPlatformSettings>(API.settings.root, body),
};

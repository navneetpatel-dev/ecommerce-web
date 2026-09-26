import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import { publicSettingsApi } from "@/shared/api/publicSettings.api";

export type { PublicPlatformSettings } from "@/shared/api/publicSettings.api";
import type { PublicPlatformSettings } from "@/shared/api/publicSettings.api";

export type AdminPlatformSettings = PublicPlatformSettings & {
  defaultCommissionRate: number;
  tcsRatePercent: number;
  tdsRatePercent: number;
  /** 194-O(4) sole-proprietor exemption threshold, in rupees per financial year. */
  tds194oExemptionThreshold: number;
  commissionGstRatePercent: number;
  platformGstin: string;
  platformLegalName: string;
  platformState: string;
  autoApproveProducts: boolean;
  payoutCycle: string;
  returnShippingFee: number;
  deliveryAgentPerTaskEarning: number;
  promotionalPointsTtlDays: number;
  refundSlaBusinessDays: number;
  scheduledReportsEnabled: boolean;
  scheduledReportsTypes: string[];
  scheduledReportsRecipients: string[];
  scheduledReportsDayOfWeek: number;
  scheduledReportsHourUtc: number;
};

export const settingsApi = {
  getPublic: publicSettingsApi.getPublic,
  get: () => apiClient.get<AdminPlatformSettings>(API.settings.root),
  update: (body: AdminPlatformSettings) =>
    apiClient.put<AdminPlatformSettings>(API.settings.root, body),
};

"use client";

import { API } from "@/shared/constants/apiRoutes";
import { useReportPanel } from "@/features/reports";
import {
  reportsApi,
  type WalletRechargeReport,
} from "../../api/finance/reports.api";

export function useWalletRechargeReport() {
  return useReportPanel<WalletRechargeReport>({
    fetchReport: ({ from, to, page }) =>
      reportsApi.adminWalletRecharge({
        from,
        to,
        page,
        limit: 50,
      }),
    exportPath: ({ from, to }, format) =>
      reportsApi.exportUrl(API.reports.adminWalletRecharge, {
        from,
        to,
        format,
      }),
    documentKey: "admin-wallet-recharge",
  });
}

"use client";

import { API } from "@/shared/constants/apiRoutes";
import { useReportPanel } from "@/features/reports";
import { reportsApi, type WalletRechargeReport } from "../api/reports.api";

export function useWalletRechargeReport() {
  return useReportPanel<WalletRechargeReport>({
    fetchReport: ({ from, to, page }) =>
      reportsApi.adminWalletRecharge({
        from: `${from}T00:00:00.000Z`,
        to: `${to}T23:59:59.999Z`,
        page,
        limit: 50,
      }),
    exportPath: ({ from, to }, format) =>
      reportsApi.exportUrl(API.reports.adminWalletRecharge, {
        from: `${from}T00:00:00.000Z`,
        to: `${to}T23:59:59.999Z`,
        format,
      }),
    documentKey: "admin-wallet-recharge",
  });
}

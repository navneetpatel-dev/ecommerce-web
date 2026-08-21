"use client";

import { API } from "@/shared/constants/apiRoutes";
import { useReportPanel } from "@/shared/hooks/useReportPanel";
import { reportsApi, type WalletLiabilityReport } from "../api/reports.api";

/** Owns the wallet liability report panel state (Rule 1/12). */
export function useWalletLiabilityReport() {
  const panel = useReportPanel<WalletLiabilityReport>({
    fetchReport: ({ from, to, page }) =>
      reportsApi.adminWalletLiability({
        from: `${from}T00:00:00.000Z`,
        to: `${to}T23:59:59.999Z`,
        page,
        limit: 50,
      }),
    exportPath: ({ from, to, page }, format) =>
      reportsApi.exportUrl(API.reports.adminWalletLiability, {
        from: `${from}T00:00:00.000Z`,
        to: `${to}T23:59:59.999Z`,
        page,
        limit: 50,
        format,
      }),
    filenameBase: "wallet-liability",
  });

  return panel;
}

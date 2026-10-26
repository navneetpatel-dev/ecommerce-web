"use client";

import { API } from "@/shared/constants/apiRoutes";
import { useReportPanel } from "@/features/reports";
import {
  reportsApi,
  type WalletLiabilityReport,
} from "../../api/finance/reports.api";

/** Owns the wallet liability report panel state (Rule 1/12). */
export function useWalletLiabilityReport() {
  const panel = useReportPanel<WalletLiabilityReport>({
    fetchReport: ({ from, to, page }) =>
      reportsApi.adminWalletLiability({
        from,
        to,
        page,
        limit: 50,
      }),
    exportPath: ({ from, to }, format) =>
      reportsApi.exportUrl(API.reports.adminWalletLiability, {
        from,
        to,
        format,
      }),
    documentKey: "admin-wallet-liability",
  });

  return panel;
}

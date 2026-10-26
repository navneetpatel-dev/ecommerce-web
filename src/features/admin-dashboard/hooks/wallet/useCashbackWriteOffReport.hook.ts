"use client";

import { useState } from "react";
import { API } from "@/shared/constants/apiRoutes";
import { useReportPanel } from "@/features/reports";
import {
  reportsApi,
  type CashbackWriteOffReport,
} from "../../api/finance/reports.api";

export type WriteOffBornBy = "ALL" | "PLATFORM" | "VENDOR";

/** Owns the cashback write-off report panel state (Rule 1/12). */
export function useCashbackWriteOffReport() {
  const [bornBy, setBornBy] = useState<WriteOffBornBy>("ALL");

  const panel = useReportPanel<CashbackWriteOffReport>({
    fetchReport: ({ from, to, page }) => {
      const bornOn: "PLATFORM" | "VENDOR" | undefined =
        bornBy === "ALL" ? undefined : bornBy;
      return reportsApi.adminCashbackWriteOffs({
        from,
        to,
        bornBy: bornOn,
        page,
        limit: 50,
      });
    },
    exportPath: ({ from, to }, format) => {
      const bornOn = bornBy === "ALL" ? undefined : bornBy;
      const bornQuery = bornOn ? `&bornBy=${bornOn}` : "";
      return `${API.reports.adminCashbackWriteOffs}?from=${encodeURIComponent(
        from,
      )}&to=${encodeURIComponent(to)}&format=${format}${bornQuery}`;
    },
    documentKey: "admin-cashback-write-offs",
  });

  return { ...panel, bornBy, setBornBy };
}

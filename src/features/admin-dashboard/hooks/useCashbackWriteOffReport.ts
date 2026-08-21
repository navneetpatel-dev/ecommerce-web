"use client";

import { useState } from "react";
import { API } from "@/shared/constants/apiRoutes";
import { useReportPanel } from "@/shared/hooks/useReportPanel";
import { reportsApi, type CashbackWriteOffReport } from "../api/reports.api";

export type WriteOffBornBy = "ALL" | "PLATFORM" | "VENDOR";

/** Owns the cashback write-off report panel state (Rule 1/12). */
export function useCashbackWriteOffReport() {
  const [bornBy, setBornBy] = useState<WriteOffBornBy>("ALL");

  const panel = useReportPanel<CashbackWriteOffReport>({
    fetchReport: ({ from, to, page }) => {
      const bornOn: "PLATFORM" | "VENDOR" | undefined =
        bornBy === "ALL" ? undefined : bornBy;
      return reportsApi.adminCashbackWriteOffs({
        from: `${from}T00:00:00.000Z`,
        to: `${to}T23:59:59.999Z`,
        bornBy: bornOn,
        page,
        limit: 50,
      });
    },
    exportPath: ({ from, to }, format) => {
      const bornOn = bornBy === "ALL" ? undefined : bornBy;
      const bornQuery = bornOn ? `&bornBy=${bornOn}` : "";
      return `${API.reports.adminCashbackWriteOffs}?from=${encodeURIComponent(
        `${from}T00:00:00.000Z`,
      )}&to=${encodeURIComponent(`${to}T23:59:59.999Z`)}&format=${format}${bornQuery}`;
    },
    filenameBase: "cashback-write-offs",
  });

  return { ...panel, bornBy, setBornBy };
}

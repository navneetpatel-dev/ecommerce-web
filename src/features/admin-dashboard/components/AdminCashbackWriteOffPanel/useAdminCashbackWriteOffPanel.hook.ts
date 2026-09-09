"use client";

import { useCashbackWriteOffReport } from "../../hooks/useCashbackWriteOffReport.hook";
import { exportFilterDisableHint } from "@/features/reports";

export function useAdminCashbackWriteOffPanel() {
  const reportPanel = useCashbackWriteOffReport();
  const {
    from,
    setFrom,
    to,
    setTo,
    bornBy,
    setBornBy,
    page,
    loading,
    controlsDisabled,
    exportingFormat,
    error,
    message,
    report,
    load,
    exportExcel,
    exportCsv,
    exportPdf,
  } = reportPanel;

  const filterHint = exportFilterDisableHint({
    message,
    exportingFormat,
    controlsDisabled,
  });

  const handleBornByChange = (value: string) => {
    setBornBy(value as typeof bornBy);
  };

  const handleLoadFirstPage = () => {
    void load(1);
  };

  const handleLoadPage = (next: number) => {
    void load(next);
  };

  return {
    from,
    setFrom,
    to,
    setTo,
    bornBy,
    page,
    loading,
    controlsDisabled,
    exportingFormat,
    error,
    message,
    report,
    filterHint,
    handleBornByChange,
    handleLoadFirstPage,
    handleLoadPage,
    exportExcel,
    exportCsv,
    exportPdf,
  };
}

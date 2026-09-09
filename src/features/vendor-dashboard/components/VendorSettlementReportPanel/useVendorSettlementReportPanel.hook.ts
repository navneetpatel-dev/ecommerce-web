import { exportFilterDisableHint } from "@/features/reports";
import { useVendorSettlementReport } from "../../hooks/useVendorSettlementReport.hook";

export function useVendorSettlementReportPanel() {
  const {
    vendorId,
    from,
    setFrom,
    to,
    setTo,
    loading,
    controlsDisabled,
    exportingFormat,
    error,
    message,
    summary,
    load,
    exportExcel,
    exportCsv,
    exportPdf,
  } = useVendorSettlementReport();

  const filterHint = exportFilterDisableHint({
    message,
    exportingFormat,
    controlsDisabled,
  });

  const handleLoadClick = () => {
    void load();
  };

  return {
    vendorId,
    from,
    setFrom,
    to,
    setTo,
    loading,
    controlsDisabled,
    exportingFormat,
    error,
    message,
    summary,
    filterHint,
    handleLoadClick,
    exportExcel,
    exportCsv,
    exportPdf,
  };
}

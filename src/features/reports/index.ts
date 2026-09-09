// Reports feature — public API
//
// Owns the reporting/analytics hub for vendors and admins: the reports
// engine API client (catalog of available reports, running reports with
// filters), the reusable ReportFilterBar and ReportTable components, the
// useReportHub hook, and the AdminReportsPage/VendorReportsPage rendered by
// the workspace dashboard report routes. The reports engine API is also
// consumed by the orders feature for order-level reporting.
export { AdminReportsPage } from "./pages/admin/AdminReportsPage.page";
export { VendorReportsPage } from "./pages/vendor/VendorReportsPage.page";
export {
  reportsEngineApi,
  downloadReportFile,
  buildReportExportFilenameFallback,
  type ReportCatalogItem,
} from "./api/table/reportsEngine.api";
export {
  defaultRange,
  normalizeExportFormat,
  labelForKey,
  type ExportFileFormat,
} from "./hooks/table/useReportHubHelpers/index";
export { getReportExportErrorMessage } from "./utils/export/reportExportErrorMessage";
export { deriveExportControlsState } from "./utils/export/exportControlsState";
export type { ReportExportControlsState } from "./utils/export/exportControlsState";
export {
  exportFilterDisableHint,
  exportButtonDisableHint,
  resolveExportStatusDisplay,
} from "./utils/export/exportDisableHint";
export { ReportExportButtons } from "./components/export/ReportExportButtons.component";
export { ReportExportStatus } from "./components/export/ReportExportStatus.component";
export { CustomerOrderHistoryPanel } from "./components/customer-order-history/CustomerOrderHistoryPanel.component";
export {
  useReportPanel,
  type ReportRangeInput,
  type UseReportPanelParams,
} from "./hooks/export/useReportPanel.hook";
export { useReportExport } from "./hooks/export/useReportExport.hook";

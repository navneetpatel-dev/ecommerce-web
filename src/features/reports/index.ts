// Reports feature — public API
//
// Owns the reporting/analytics hub for vendors and admins: the reports
// engine API client (catalog of available reports, running reports with
// filters), the reusable ReportFilterBar and ReportTable components, the
// useReportHub hook, and the AdminReportsPage/VendorReportsPage rendered by
// the workspace dashboard report routes. The reports engine API is also
// consumed by the orders feature for order-level reporting.
export { AdminReportsPage } from "./pages/AdminReportsPage.page";
export { VendorReportsPage } from "./pages/VendorReportsPage.page";
export {
  reportsEngineApi,
  downloadReportFile,
  buildReportExportFilenameFallback,
  type ReportCatalogItem,
} from "./api/reportsEngine.api";
export {
  defaultRange,
  normalizeExportFormat,
  labelForKey,
  type ExportFileFormat,
} from "./hooks/useReportHubHelpers/index";
export { getReportExportErrorMessage } from "./utils/reportExportErrorMessage";
export { deriveExportControlsState } from "./utils/exportControlsState";
export type { ReportExportControlsState } from "./utils/exportControlsState";
export {
  exportFilterDisableHint,
  exportButtonDisableHint,
  resolveExportStatusDisplay,
} from "./utils/exportDisableHint";
export { ReportExportButtons } from "./components/ReportExportButtons.component";
export { ReportExportStatus } from "./components/ReportExportStatus.component";
export { CustomerOrderHistoryPanel } from "./components/CustomerOrderHistoryPanel.component";

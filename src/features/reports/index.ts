// Reports feature — public API
//
// Owns the reporting/analytics hub for vendors and admins: the reports
// engine API client (catalog of available reports, running reports with
// filters), the reusable ReportFilterBar and ReportTable components, the
// useReportHub hook, and the AdminReportsPage/VendorReportsPage rendered by
// the workspace dashboard report routes. The reports engine API is also
// consumed by the orders feature for order-level reporting.
export { AdminReportsPage } from "./pages/AdminReportsPage";
export { VendorReportsPage } from "./pages/VendorReportsPage";
export { reportsEngineApi } from "./api/reportsEngine.api";

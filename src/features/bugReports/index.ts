// Bug Reports feature — public API
//
// Owns the bug-report workflow shared by customers, vendors and admins:
// data access (bugReports.api, bugReports.queries), report lists, cards,
// filters, detail views, the submission form (with attachment uploading),
// field limits and label helpers, and the role-specific pages (customer
// list/new/detail, vendor list/new/detail, admin list/detail) rendered by
// the storefront support and workspace dashboard bug-report routes.
export { CustomerBugReportsPage } from "./pages/CustomerBugReportsPage.page";
export { CustomerNewBugReportPage } from "./pages/CustomerNewBugReportPage.page";
export { CustomerBugReportDetailPage } from "./pages/CustomerBugReportDetailPage.page";
export { VendorBugReportsPage } from "./pages/VendorBugReportsPage.page";
export { VendorNewBugReportPage } from "./pages/VendorNewBugReportPage.page";
export { VendorBugReportDetailPage } from "./pages/VendorBugReportDetailPage.page";
export { AdminBugReportsPage } from "./pages/AdminBugReportsPage.page";
export { AdminBugReportDetailPage } from "./pages/AdminBugReportDetailPage.page";

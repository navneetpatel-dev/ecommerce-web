/** Platform settings copy. Subset of LABELS; merged in labels/index.ts. */
export const settingsLabels = {
  platformSettings: "Platform Settings",
  platformSettingsHint:
    "Manage commission, returns, shipping thresholds, support contact, and moderation defaults.",
  settingsCommerce: "Commerce",
  settingsCommerceHint: "Commission and product moderation defaults.",
  settingsFulfillment: "Fulfillment",
  settingsFulfillmentHint: "Returns, free shipping, and payout timing.",
  settingsSupport: "Support",
  settingsSupportHint: "Customer-facing contact details and helpdesk windows.",
  ticketReopenWindowDays: "Ticket reopen window",
  ticketReopenWindowDaysHint:
    "Days after resolve during which a customer may reopen a support ticket.",
  bugVerifyWindowDays: "Bug auto-verify window",
  bugVerifyWindowDaysHint:
    "Days after a bug is marked fixed before it auto-transitions to verified.",
  bugCloseWindowDays: "Bug auto-close window",
  bugCloseWindowDaysHint:
    "Days after a bug is verified before it auto-transitions to closed.",
  defaultCommissionRate: "Default commission rate",
  tcsRatePercent: "Marketplace TCS rate (%)",
  tcsRateHint:
    "Tax collected at source under CGST Act s.52 on taxable marketplace sales. Set 0 to disable.",
  tdsRatePercent: "TDS rate at payout (%)",
  tdsRateHint:
    "TDS under section 194-O deducted when settling vendor payouts. Set 0 to disable.",
  commissionGstRatePercent: "Commission GST rate (%)",
  commissionGstRateHint:
    "GST charged on marketplace commission invoices issued to vendors (SAC 9985).",
  platformLegalName: "Platform legal name",
  platformGstin: "Platform GSTIN",
  platformGstinHint: "Ecommerce operator GSTIN used on commission invoices and GSTR-8.",
  platformState: "Platform state",
  reports: "Reports",
  reportsHubHint:
    "Filtered, paginated tabular reports with Excel export from frozen ledger data.",
  reportFilters: "Filters",
  reportFiltersHint:
    "Choose a report and date range, then load or export results.",
  reportSelect: "Report",
  reportCategory: "Category",
  reportStatus: "Status",
  reportVendor: "Vendor",
  exportExcel: "Export Excel",
  reportAsyncPreparing: "Preparing your export…",
  reportAsyncWaiting: "Generating your file — this usually takes a few seconds…",
  reportAsyncWaitingSeconds: "Still generating your file… ({seconds}s)",
  reportAsyncResuming: "Finishing your previous export…",
  reportAsyncResumingSeconds: "Still finishing your export… ({seconds}s)",
  reportAsyncGeneratingPdf: "Creating your PDF…",
  reportAsyncGeneratingCsv: "Building your CSV…",
  reportAsyncGeneratingXlsx: "Building your spreadsheet…",
  reportAsyncGeneratingSeconds: "Still creating your file… ({seconds}s)",
  reportAsyncEmptyRange:
    "No transactions in this date range — creating an empty statement…",
  reportAsyncTimeout:
    "This is taking longer than expected — try again in a moment or pick a shorter date range.",
  reportExportTooManyPending: "You already have exports in progress. Wait for them to finish.",
  reportExportLocked: "Another export is running — wait for it to finish.",
  reportExportFiltersLocked:
    "Filters are locked while your export finishes.",
  reportExportButtonLocked:
    "Wait for the current export to finish before starting another.",
  reportExportOtherFormatLocked:
    "Wait for the current export to finish before choosing another format.",
  reportExportSelectReportFirst: "Choose a report before exporting.",
  reportExportLoadReportFirst: "Load the report before exporting.",
  reportAsyncReady: "Download starting…",
  reportAsyncCached: "Using your recent export — download starting…",
  reportAsyncFailed: "Export failed. Try again with a narrower date range.",
  reportInvalidRange: "The end date must be on or after the start date.",
  reportLoadError: "Could not load report.",
  reportCatalogError: "Could not load report catalog.",
  reportExportsOps: "Export queue (ops)",
  reportExportQueueDepth: "Queue: {waiting} waiting · {active} active · {failed} failed",
  reportExportRetry: "Retry",
  reportExportRetryQueued: "Export re-queued.",
  noReportExports: "No recent exports.",
  reportType: "Report type",
  format: "Format",
  rows: "Rows",
  uuidPlaceholder: "UUID",
  refundsToCustomer: "Refunds to customer",
  emptyCell: "—",
  approvedCount: "Approved",
  pendingCount: "Pending",
  rejectedCount: "Rejected",
  // Report column headers not already covered above (must match BE REPORT_COLUMN_LABELS keys)
} as const;

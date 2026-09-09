import { apiClient } from "@/shared/api/client";
import { downloadFile } from "@/shared/api/downloadFile";
import {
  buildReportExportFilenameFallback,
  buildTaxInvoiceFilenameFallback,
} from "@/shared/utils/downloadFilename";
import { API } from "@/shared/constants/apiRoutes";

export type ReportColumnMeta = {
  key: string;
  labelKey: string;
  format?: string;
};

export type ReportCatalogItem = {
  type: string;
  labelKey: string;
  audience: string;
  financial: boolean;
  vendorScoped: boolean;
  columns: ReportColumnMeta[];
};

export type ReportRunResult = {
  reportType: string;
  columns: ReportColumnMeta[];
  rows: Record<string, unknown>[];
  meta: Record<string, unknown> | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ReportFiltersInput = {
  from: string;
  to: string;
  page?: number;
  limit?: number;
  vendorId?: string;
  categoryId?: string;
  status?: string;
};

function buildQuery(filters: ReportFiltersInput & { format?: string }) {
  const params = new URLSearchParams();
  params.set("from", filters.from);
  params.set("to", filters.to);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.vendorId) params.set("vendorId", filters.vendorId);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.status) params.set("status", filters.status);
  if (filters.format) params.set("format", filters.format);
  return params.toString();
}

export async function downloadReportFile(path: string, fallbackName: string) {
  await downloadFile(path, fallbackName);
}

export { buildReportExportFilenameFallback };

export const reportsEngineApi = {
  catalog: () => apiClient.get<ReportCatalogItem[]>(API.reports.catalog),
  run: (type: string, filters: ReportFiltersInput) =>
    apiClient.get<ReportRunResult>(
      API.reports.run(type, buildQuery({ ...filters, format: "json" })),
    ),
  exportExcel: (type: string, filters: ReportFiltersInput) =>
    downloadFile(
      API.reports.run(type, buildQuery({ ...filters, format: "xlsx" })),
      buildReportExportFilenameFallback(type, filters.from, filters.to, "xlsx"),
    ),
  exportCsv: (type: string, filters: ReportFiltersInput) =>
    downloadFile(
      API.reports.run(type, buildQuery({ ...filters, format: "csv" })),
      buildReportExportFilenameFallback(type, filters.from, filters.to, "csv"),
    ),
  exportPdf: (type: string, filters: ReportFiltersInput) =>
    downloadFile(
      API.reports.run(type, buildQuery({ ...filters, format: "pdf" })),
      buildReportExportFilenameFallback(type, filters.from, filters.to, "pdf"),
    ),
  customerOrderHistoryExport: (
    filters: ReportFiltersInput,
    format: "xlsx" | "csv" | "pdf" = "xlsx",
  ) =>
    downloadFile(
      API.reports.customerOrderHistory(buildQuery({ ...filters, format })),
      buildReportExportFilenameFallback(
        "customer-order-history",
        filters.from,
        filters.to,
        format,
      ),
    ),
  customerOrderHistory: (filters: ReportFiltersInput) =>
    apiClient.get<ReportRunResult>(
      API.reports.customerOrderHistory(
        buildQuery({ ...filters, format: "json" }),
      ),
    ),
  customerOrderInvoice: (orderId: string) =>
    downloadFile(
      API.reports.customerOrderInvoice(orderId),
      buildTaxInvoiceFilenameFallback(orderId),
    ),
  customerOrderSubInvoice: (orderId: string, subOrderId: string) =>
    downloadFile(
      API.reports.customerOrderSubInvoice(orderId, subOrderId),
      buildTaxInvoiceFilenameFallback(orderId),
    ),
  vendorSubOrderInvoice: (subOrderId: string) =>
    downloadFile(
      API.reports.vendorSubOrderInvoice(subOrderId),
      `gst-tax-invoice_suborder-${subOrderId.slice(0, 8)}.pdf`,
    ),
};

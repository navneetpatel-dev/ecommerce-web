import { getApiSessionAdapter } from "@/shared/api/sessionAdapter";
import { apiClient } from "@/shared/api/client";
import {
  buildReportExportFilenameFallback,
  buildTaxInvoiceFilenameFallback,
  resolveDownloadFilename,
} from "@/shared/utils/downloadFilename";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { API } from "@/shared/constants/apiRoutes";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { EXPORT_DOWNLOAD_TIMEOUT_MS } from "@/shared/constants/timing";
import { apiErrorFromFailureBody } from "@/shared/utils/apiErrorMessage";
import { ApiError } from "@/shared/types/apiError.types";

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

async function downloadBlob(path: string, fallbackName: string) {
  const token = getApiSessionAdapter().getAccessToken();
  const res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
    credentials: "include",
    cache: "no-store",
    signal: AbortSignal.timeout(EXPORT_DOWNLOAD_TIMEOUT_MS),
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  });
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* non-JSON error body */
    }
    const err = apiErrorFromFailureBody(body, res.status);
    (err as ApiError & { status?: number }).status = res.status;
    throw err;
  }
  const blob = await res.blob();
  triggerBlobDownload(blob, resolveDownloadFilename(res, fallbackName));
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadReportFile(path: string, fallbackName: string) {
  await downloadBlob(path, fallbackName);
}

export { buildReportExportFilenameFallback };

export const reportsEngineApi = {
  catalog: () => apiClient.get<ReportCatalogItem[]>(API.reports.catalog),
  run: (type: string, filters: ReportFiltersInput) =>
    apiClient.get<ReportRunResult>(
      API.reports.run(type, buildQuery({ ...filters, format: "json" })),
    ),
  exportExcel: (type: string, filters: ReportFiltersInput) =>
    downloadBlob(
      API.reports.run(type, buildQuery({ ...filters, format: "xlsx" })),
      buildReportExportFilenameFallback(type, filters.from, filters.to, "xlsx"),
    ),
  exportCsv: (type: string, filters: ReportFiltersInput) =>
    downloadBlob(
      API.reports.run(type, buildQuery({ ...filters, format: "csv" })),
      buildReportExportFilenameFallback(type, filters.from, filters.to, "csv"),
    ),
  exportPdf: (type: string, filters: ReportFiltersInput) =>
    downloadBlob(
      API.reports.run(type, buildQuery({ ...filters, format: "pdf" })),
      buildReportExportFilenameFallback(type, filters.from, filters.to, "pdf"),
    ),
  customerOrderHistoryExport: (
    filters: ReportFiltersInput,
    format: "xlsx" | "csv" | "pdf" = "xlsx",
  ) =>
    downloadBlob(
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
    downloadBlob(
      API.reports.customerOrderInvoice(orderId),
      buildTaxInvoiceFilenameFallback(orderId),
    ),
  customerOrderSubInvoice: (orderId: string, subOrderId: string) =>
    downloadBlob(
      API.reports.customerOrderSubInvoice(orderId, subOrderId),
      buildTaxInvoiceFilenameFallback(orderId),
    ),
  vendorSubOrderInvoice: (subOrderId: string) =>
    downloadBlob(
      API.reports.vendorSubOrderInvoice(subOrderId),
      `gst-tax-invoice_suborder-${subOrderId.slice(0, 8)}.pdf`,
    ),
};

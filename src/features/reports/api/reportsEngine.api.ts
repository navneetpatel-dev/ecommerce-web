import { apiClient } from "@/shared/api/client";
import {
  buildDatedExportFilenameFallback,
  buildReportExportFilenameFallback,
  buildTaxInvoiceFilenameFallback,
  resolveDownloadFilename,
} from "@/shared/utils/downloadFilename";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { API } from "@/shared/constants/apiRoutes";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { LABELS } from "@/shared/constants/labels";
import { EXPORT_DOWNLOAD_TIMEOUT_MS } from "@/shared/constants/timing";
import { useAuthStore } from "@/shared/stores/auth.store";

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

export type AsyncExportResponse = {
  async: true;
  exportId: string;
  status: string;
  format?: string;
  rowCount: number;
  rowCountKnown?: boolean;
  cached?: boolean;
};

export type ExportStatusResult = {
  id: string;
  reportType: string;
  format: string;
  status: string;
  rowCount: number;
  rowCountKnown: boolean;
  fileUrl: string | null;
  downloadUrl: string | null;
  expiresIn: number | null;
  errorMessage: string | null;
  filterFrom: string | null;
  filterTo: string | null;
  etag: string;
};

export type ExportStatusPollResult =
  | { notModified: true; etag: string }
  | ExportStatusResult;

export type AdminExportRow = {
  id: string;
  userId: string;
  reportType: string;
  format: string;
  status: string;
  rowCount: number;
  byteSize: number | null;
  errorMessage: string | null;
  exportedAt: string;
  filtersUsed: Record<string, unknown> | null;
};

export type AdminExportsListResult = {
  rows: AdminExportRow[];
  queue: { waiting: number; active: number; failed: number };
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
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
    credentials: "include",
    signal: AbortSignal.timeout(EXPORT_DOWNLOAD_TIMEOUT_MS),
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(LABELS.couldNotLoadReport);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = resolveDownloadFilename(res, fallbackName);
  a.click();
  URL.revokeObjectURL(url);
}

function triggerPresignedDownload(url: string, fallbackName?: string) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  a.target = "_blank";
  if (fallbackName) a.download = fallbackName;
  a.click();
}

async function fetchExportStatus(
  id: string,
  ifNoneMatch?: string,
): Promise<ExportStatusPollResult> {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(`${CLIENT_API_BASE_URL}${API.reports.exportStatus(id)}`, {
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `${BEARER_PREFIX}${token}` } : {}),
      ...(ifNoneMatch ? { "If-None-Match": ifNoneMatch } : {}),
    },
  });
  if (res.status === 304) {
    const etag = res.headers.get("ETag") ?? ifNoneMatch ?? "";
    return { notModified: true, etag };
  }
  if (!res.ok) {
    throw new Error(LABELS.couldNotLoadReport);
  }
  const body = (await res.json()) as { success: boolean; data: ExportStatusResult };
  if (!body.success) {
    throw new Error(LABELS.couldNotLoadReport);
  }
  return body.data;
}

export const reportsEngineApi = {
  catalog: () => apiClient.get<ReportCatalogItem[]>(API.reports.catalog),
  run: (type: string, filters: ReportFiltersInput) =>
    apiClient.get<ReportRunResult>(
      API.reports.run(type, buildQuery({ ...filters, format: "json" })),
    ),
  exportExcel: (type: string, filters: ReportFiltersInput) =>
    apiClient.get<AsyncExportResponse>(
      API.reports.run(type, buildQuery({ ...filters, format: "xlsx" })),
    ),
  exportCsv: (type: string, filters: ReportFiltersInput) =>
    apiClient.get<AsyncExportResponse>(
      API.reports.run(type, buildQuery({ ...filters, format: "csv" })),
    ),
  exportPdf: (type: string, filters: ReportFiltersInput) =>
    apiClient.get<AsyncExportResponse>(
      API.reports.run(type, buildQuery({ ...filters, format: "pdf" })),
    ),
  downloadExport: async (
    id: string,
    reportType?: string,
    from?: string,
    to?: string,
    extension: "csv" | "pdf" | "xlsx" = "xlsx",
    downloadUrl?: string | null,
  ) => {
    const fallback =
      reportType && from && to
        ? buildReportExportFilenameFallback(reportType, from, to, extension)
        : `report-export_${id}.${extension}`;
    if (downloadUrl) {
      triggerPresignedDownload(downloadUrl, fallback);
      return;
    }
    const status = await fetchExportStatus(id);
    if ("notModified" in status) {
      await downloadBlob(API.reports.exportDownload(id), fallback);
      return;
    }
    if (status.downloadUrl) {
      triggerPresignedDownload(status.downloadUrl, fallback);
      return;
    }
    await downloadBlob(API.reports.exportDownload(id), fallback);
  },
  exportStatus: fetchExportStatus,
  listAdminExports: (filters?: { status?: string; reportType?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.reportType) params.set("reportType", filters.reportType);
    const qs = params.toString();
    return apiClient.get<AdminExportsListResult>(API.reports.adminExports(qs));
  },
  retryAdminExport: (id: string) =>
    apiClient.post<AsyncExportResponse>(API.reports.adminExportRetry(id), {}),
  retryExport: (id: string) =>
    apiClient.post<AsyncExportResponse>(API.reports.exportRetry(id), {}),
  customerOrderHistoryExport: (
    filters: ReportFiltersInput,
    format: "xlsx" | "csv" | "pdf" = "xlsx",
  ) =>
    apiClient.get<AsyncExportResponse>(
      API.reports.customerOrderHistory(buildQuery({ ...filters, format })),
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

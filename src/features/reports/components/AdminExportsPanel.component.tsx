"use client";

import { useEffect, useMemo, useState } from "react";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  reportsEngineApi,
  type AdminExportRow,
} from "../api/reportsEngine.api";
import { normalizeExportFormat } from "../hooks/useReportHubHelpers/index";
import {
  followAsyncExport,
  isBenignExportError,
} from "../utils/asyncExportFlow";
import {
  runReportExport,
  ReportExportLockedError,
} from "../utils/runReportExport";
import { getReportExportErrorMessage } from "../utils/reportExportErrorMessage";
import { useReportExportLockStore } from "../stores/reportExportLock.store";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { ReportExportStatus } from "./ReportExportStatus.component";

function filterDatePart(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return value.slice(0, 10);
}

function formatRowCount(row: AdminExportRow): string {
  if (
    !row.rowCountKnown &&
    (row.status === "PROCESSING" || row.status === "PENDING")
  ) {
    return "…";
  }
  if (row.status !== "READY" && row.status !== "SYNC" && row.rowCount === 0) {
    return "—";
  }
  return String(row.rowCount);
}

export function AdminExportsPanel() {
  const [rows, setRows] = useState<AdminExportRow[]>([]);
  const [queue, setQueue] = useState({ waiting: 0, active: 0, failed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [reportTypeFilter, setReportTypeFilter] = useState("");
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);

  const filters = useMemo(
    () => ({
      status: statusFilter.trim() || undefined,
      reportType: reportTypeFilter.trim() || undefined,
    }),
    [reportTypeFilter, statusFilter],
  );

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsEngineApi.listAdminExports(filters);
      setRows(data.rows);
      setQueue(data.queue);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
      setRows([]);
      setQueue({ waiting: 0, active: 0, failed: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [filters.status, filters.reportType]);

  const retryExport = async (row: AdminExportRow) => {
    setRetryingId(row.id);
    setMessage(null);
    setError(null);
    try {
      await runReportExport(
        async () => {
          const result = await reportsEngineApi.retryAdminExport(row.id);
          const format = normalizeExportFormat(result.format ?? row.format);
          await followAsyncExport(
            {
              exportId: result.exportId,
              status: result.status,
              format,
            },
            format,
            { setMessage, setError },
            {
              downloadReady: async (exportId, fmt) => {
                await reportsEngineApi.downloadExport(
                  exportId,
                  row.reportType,
                  filterDatePart(row.filtersUsed?.from),
                  filterDatePart(row.filtersUsed?.to),
                  fmt,
                );
              },
            },
          );
        },
        { onMessage: setMessage, onError: setError },
      );
      await load();
    } catch (err) {
      if (isBenignExportError(err)) return;
      setError(getReportExportErrorMessage(err, LABELS.reportLoadError));
    } finally {
      setRetryingId(null);
    }
  };

  const downloadReadyExport = (row: AdminExportRow) => {
    if (globalLocked) {
      setError(LABELS.reportExportLocked);
      return;
    }
    void runReportExport(
      () =>
        reportsEngineApi.downloadExport(
          row.id,
          row.reportType,
          filterDatePart(row.filtersUsed?.from),
          filterDatePart(row.filtersUsed?.to),
          normalizeExportFormat(row.format),
        ),
      { onError: setError },
    ).catch((err) => {
      if (err instanceof ReportExportLockedError) {
        setError(LABELS.reportExportLocked);
        return;
      }
      setError(getReportExportErrorMessage(err, LABELS.reportLoadError));
    });
  };

  const queueLabel = LABELS.reportExportQueueDepth
    .replace("{waiting}", String(queue.waiting))
    .replace("{active}", String(queue.active))
    .replace("{failed}", String(queue.failed));

  const filterHint = globalLocked ? LABELS.reportExportLocked : "";

  return (
    <FormSection title={LABELS.reportExportsOps} columns={1}>
      <div className="space-y-3">
        <p className="text-body-sm text-ink-muted">{queueLabel}</p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-body-sm">
            <span className="text-ink-muted">{LABELS.status}</span>
            <DisabledActionHint disabled={globalLocked} message={filterHint} block>
              <Input
                value={statusFilter}
                disabled={globalLocked}
                onChange={(e) => setStatusFilter(e.target.value)}
                placeholder="PENDING"
              />
            </DisabledActionHint>
          </label>
          <label className="flex flex-col gap-1 text-body-sm">
            <span className="text-ink-muted">{LABELS.reportType}</span>
            <DisabledActionHint disabled={globalLocked} message={filterHint} block>
              <Input
                value={reportTypeFilter}
                disabled={globalLocked}
                onChange={(e) => setReportTypeFilter(e.target.value)}
                placeholder="gmv-sales"
              />
            </DisabledActionHint>
          </label>
          <DisabledActionHint disabled={globalLocked} message={filterHint}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={loading}
              disabled={globalLocked}
              onClick={() => void load()}
            >
              {LABELS.refresh}
            </Button>
          </DisabledActionHint>
        </div>
        <ReportExportStatus
          message={message}
          error={error}
          controlsDisabled={globalLocked || retryingId !== null}
          locked={globalLocked}
        />
        <div className="overflow-x-auto">
          <table className="min-w-full text-body-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="px-2 py-2">{LABELS.userId}</th>
                <th className="px-2 py-2">{LABELS.reportType}</th>
                <th className="px-2 py-2">{LABELS.format}</th>
                <th className="px-2 py-2">{LABELS.status}</th>
                <th className="px-2 py-2">{LABELS.rows}</th>
                <th className="px-2 py-2">{LABELS.actions}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-line/60">
                  <td className="px-2 py-2 font-mono text-xs">
                    {row.userId.slice(0, 8)}…
                  </td>
                  <td className="px-2 py-2">{row.reportType}</td>
                  <td className="px-2 py-2 uppercase">{row.format}</td>
                  <td className="px-2 py-2">{row.status}</td>
                  <td className="px-2 py-2">{formatRowCount(row)}</td>
                  <td className="px-2 py-2">
                    {row.status === "READY" ? (
                      <DisabledActionHint
                        disabled={globalLocked}
                        message={filterHint}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={globalLocked}
                          onClick={() => downloadReadyExport(row)}
                        >
                          {LABELS.download}
                        </Button>
                      </DisabledActionHint>
                    ) : row.status === "FAILED" ? (
                      <div className="flex flex-col gap-1">
                        {row.errorMessage ? (
                          <span className="text-danger">
                            {row.errorMessage}
                          </span>
                        ) : null}
                        <DisabledActionHint
                          disabled={globalLocked}
                          message={filterHint}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            loading={retryingId === row.id}
                            disabled={globalLocked}
                            onClick={() => void retryExport(row)}
                          >
                            {LABELS.reportExportRetry}
                          </Button>
                        </DisabledActionHint>
                      </div>
                    ) : row.errorMessage ? (
                      <span className="text-danger">{row.errorMessage}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-2 py-4 text-ink-muted">
                    {LABELS.noReportExports}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </FormSection>
  );
}

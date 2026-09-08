"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Upload } from "lucide-react";
import {
  deliveryAdminApi,
  type BulkCreateAgentResult,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { FilePicker } from "@/shared/components/FilePicker.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

const EXPECTED_COLUMNS = [
  "email",
  "password",
  "fullName",
  "phone",
  "vehicleType",
  "hubOrZone",
] as const;

const MAX_ROWS = 200;
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB

interface ParsedRow {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  hubOrZone: string;
}

/**
 * Minimal CSV parser for a fixed, simple column set (no library — this app has no CSV
 * import precedent, and agent onboarding data is not expected to contain embedded commas
 * or quoted fields).
 */
function parseAgentsCsv(text: string): {
  rows: ParsedRow[];
  error: string | null;
} {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      rows: [],
      error: "CSV must have a header row and at least one data row.",
    };
  }
  if (lines.length - 1 > MAX_ROWS) {
    return {
      rows: [],
      error: `CSV file exceeds the ${MAX_ROWS}-row limit (found ${lines.length - 1} rows).`,
    };
  }
  const firstLine = lines[0] ?? "";
  const header = firstLine.split(",").map((cell) => cell.trim());
  const missing = EXPECTED_COLUMNS.filter((col) => !header.includes(col));
  if (missing.length > 0) {
    return { rows: [], error: `Missing column(s): ${missing.join(", ")}` };
  }

  const rows: ParsedRow[] = lines.slice(1).map((line) => {
    const cells = line.split(",").map((cell) => cell.trim());
    const record: Record<string, string> = {};
    header.forEach((col, index) => {
      record[col] = cells[index] ?? "";
    });
    return {
      email: record.email || "",
      password: record.password || "",
      fullName: record.fullName || "",
      phone: record.phone || "",
      vehicleType: record.vehicleType || "BIKE",
      hubOrZone: record.hubOrZone || "",
    };
  });

  return { rows, error: null };
}

import { cn } from "@/shared/utils/cn";

export function BulkImportAgentsDialog({
  onImported,
  triggerVariant = "outline",
  triggerClassName,
}: {
  onImported: () => void;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost";
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<
    "xlsx" | "csv" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BulkCreateAgentResult[] | null>(null);

  const reset = () => {
    setFile(null);
    setError(null);
    setResults(null);
    setDownloadingFormat(null);
  };

  const handleDownloadTemplate = async (format: "xlsx" | "csv") => {
    setDownloadingFormat(format);
    try {
      await deliveryAdminApi.downloadBulkTemplate(format);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not download sample template."));
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please choose an Excel or CSV file to import.");
      return;
    }
    setError(null);
    setResults(null);
    setPending(true);

    try {
      const isXlsx =
        file.name.endsWith(".xlsx") ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (isXlsx) {
        // Upload Excel file directly to backend parser
        const rowResults = await deliveryAdminApi.bulkImportFile(file);
        setResults(rowResults);
        if (rowResults.some((row) => row.success)) onImported();
      } else {
        // Parse CSV client-side with fast feedback, then bulkCreate
        const text = await file.text();
        const { rows, error: parseError } = parseAgentsCsv(text);
        if (parseError) {
          setError(parseError);
          setPending(false);
          return;
        }
        const rowResults = await deliveryAdminApi.bulkCreate(rows);
        setResults(rowResults);
        if (rowResults.some((row) => row.success)) onImported();
      }
    } catch (importError) {
      setError(getApiErrorMessage(importError, "Could not import agents."));
    } finally {
      setPending(false);
    }
  };

  const successCount = results?.filter((r) => r.success).length ?? 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          size="sm"
          className={cn("gap-1.5 select-none", triggerClassName)}
        >
          <FileSpreadsheet
            className="size-4 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
          <span>Bulk import</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl sm:max-w-2xl w-full">
        <DialogHeader className="text-left border-b border-line/60 pb-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand shadow-xs">
              <FileSpreadsheet className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="font-display text-xl font-semibold text-ink">
                Bulk import delivery agents
              </DialogTitle>
              <p className="text-body-sm text-ink-muted">
                Quickly onboard multiple field agents at once using an Excel
                (.xlsx) or CSV template.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {!results ? (
            <>
              {/* Step 1: Download template */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-caption font-bold text-brand">
                    1
                  </span>
                  <h4 className="text-body-sm font-semibold text-ink tracking-normal">
                    Download sample template
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={Boolean(downloadingFormat)}
                    onClick={() => void handleDownloadTemplate("xlsx")}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 text-left transition-all hover:border-brand/60 hover:bg-surface-raised hover:shadow-xs disabled:opacity-50 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        <FileSpreadsheet
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-body-sm font-semibold text-ink group-hover:text-brand transition-colors">
                            Excel Sheet
                          </p>
                          <span className="rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 text-[0.6875rem] font-bold">
                            .xlsx
                          </span>
                        </div>
                        <p className="text-caption text-ink-muted mt-0.5">
                          Formatted spreadsheet
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 text-caption font-semibold text-brand group-hover:underline">
                      <Download className="size-3.5" aria-hidden="true" />
                      {downloadingFormat === "xlsx" ? "..." : "Download"}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={Boolean(downloadingFormat)}
                    onClick={() => void handleDownloadTemplate("csv")}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 text-left transition-all hover:border-brand/60 hover:bg-surface-raised hover:shadow-xs disabled:opacity-50 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-paper text-ink-muted border border-line">
                        <Download className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-body-sm font-semibold text-ink group-hover:text-brand transition-colors">
                            CSV Table
                          </p>
                          <span className="rounded bg-paper text-ink-muted border border-line/70 px-1.5 py-0.2 text-[0.6875rem] font-semibold">
                            .csv
                          </span>
                        </div>
                        <p className="text-caption text-ink-muted mt-0.5">
                          Plain text table
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 text-caption font-semibold text-ink-muted group-hover:text-ink group-hover:underline">
                      <Download className="size-3.5" aria-hidden="true" />
                      {downloadingFormat === "csv" ? "..." : "Download"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Schema info */}
              <div className="rounded-xl border border-line/70 bg-paper/25 p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-body-sm font-semibold text-ink">
                    Required spreadsheet columns
                  </span>
                  <span className="text-caption font-medium text-ink-muted">
                    <span className="text-danger font-bold">*</span> required
                    field
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-lg bg-surface px-2.5 py-1 font-mono text-caption text-ink border border-line/70 shadow-xs">
                    email<span className="text-danger font-bold ml-1">*</span>
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-surface px-2.5 py-1 font-mono text-caption text-ink border border-line/70 shadow-xs">
                    password
                    <span className="text-danger font-bold ml-1">*</span>
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-surface px-2.5 py-1 font-mono text-caption text-ink border border-line/70 shadow-xs">
                    fullName
                    <span className="text-danger font-bold ml-1">*</span>
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-surface px-2.5 py-1 font-mono text-caption text-ink border border-line/70 shadow-xs">
                    phone<span className="text-danger font-bold ml-1">*</span>
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-surface px-2.5 py-1 font-mono text-caption text-ink border border-line/70 shadow-xs">
                    hubOrZone
                    <span className="text-danger font-bold ml-1">*</span>
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-surface px-2.5 py-1 font-mono text-caption text-ink-muted border border-line/70 shadow-xs">
                    vehicleType{" "}
                    <span className="ml-1 text-[0.6875rem] text-ink-muted font-sans">
                      (BIKE, SCOOTER, VAN)
                    </span>
                  </span>
                </div>
                <p className="text-caption text-ink-muted leading-relaxed">
                  The first row must contain column headers. Up to 200 agents
                  per upload batch.
                </p>
              </div>

              {/* Step 2: Upload dropzone */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-caption font-bold text-brand">
                    2
                  </span>
                  <h4 className="text-body-sm font-semibold text-ink tracking-normal">
                    Choose or drop your file
                  </h4>
                </div>
                <FilePicker
                  accept=".csv,text/csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  maxBytes={MAX_FILE_BYTES}
                  maxRows={MAX_ROWS}
                  value={file}
                  onChange={(f) => {
                    setFile(f);
                    setError(null);
                  }}
                  disabled={pending}
                  hint="Excel (.xlsx) or CSV format • Max 2 MB • Up to 200 rows"
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-body-sm font-medium text-danger">
                  {error}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!file || pending}
                  loading={pending}
                  onClick={() => void handleImport()}
                  className="gap-1.5 px-4"
                >
                  <Upload className="size-3.5" aria-hidden="true" />
                  Import agents
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-5">
              <div
                className={cn(
                  "rounded-xl border p-4 space-y-1",
                  successCount > 0
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-danger/30 bg-danger/10 text-danger",
                )}
              >
                <p className="text-body font-semibold">
                  {successCount > 0 ? "Import completed" : "Import failed"}
                </p>
                <p className="text-body-sm opacity-90">
                  {successCount} of {results.length} agent(s) were successfully
                  created.
                </p>
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-line bg-paper/20 p-3 text-body-sm">
                {results.map((row) => (
                  <div
                    key={row.row}
                    className="flex items-center justify-between gap-3 rounded-lg bg-surface p-3 text-caption font-mono border border-line/50"
                  >
                    <span className="truncate text-ink font-medium">
                      Row {row.row}: {row.email}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-2 py-0.5 font-sans font-semibold text-[0.6875rem]",
                        row.success
                          ? "bg-success/15 text-success"
                          : "bg-danger/15 text-danger",
                      )}
                    >
                      {row.success ? "Created" : (row.error ?? "Failed")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={reset}
                >
                  Upload another file
                </Button>
                <Button type="button" size="sm" onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

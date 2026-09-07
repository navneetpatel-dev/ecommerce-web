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
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-left">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand shadow-xs">
              <FileSpreadsheet className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="font-display text-lg font-semibold text-ink">
                Bulk import delivery agents
              </DialogTitle>
              <p className="text-body-sm text-ink-muted">
                Quickly onboard multiple field agents at once using an Excel or
                CSV template.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {!results ? (
            <>
              {/* Step 1: Download template */}
              <div className="space-y-2">
                <span className="text-caption font-semibold uppercase tracking-wider text-ink-muted block">
                  Step 1: Download sample template
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={Boolean(downloadingFormat)}
                    onClick={() => void handleDownloadTemplate("xlsx")}
                    className="flex items-center justify-between gap-2.5 rounded-lg border border-line bg-paper/40 p-3 text-left transition-all hover:border-brand/40 hover:bg-paper/70 disabled:opacity-50 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        <FileSpreadsheet
                          className="size-4"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-sm font-medium text-ink group-hover:text-brand transition-colors">
                          Excel Sheet
                        </p>
                        <p className="text-caption text-ink-muted">
                          .xlsx format
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-caption font-semibold rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5">
                      {downloadingFormat === "xlsx" ? "..." : "Download"}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={Boolean(downloadingFormat)}
                    onClick={() => void handleDownloadTemplate("csv")}
                    className="flex items-center justify-between gap-2.5 rounded-lg border border-line bg-paper/40 p-3 text-left transition-all hover:border-brand/40 hover:bg-paper/70 disabled:opacity-50 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-paper text-ink-muted border border-line">
                        <Download className="size-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-sm font-medium text-ink group-hover:text-brand transition-colors">
                          CSV Table
                        </p>
                        <p className="text-caption text-ink-muted">
                          Plain text
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-caption font-semibold rounded bg-paper text-ink-muted border border-line/60 px-1.5 py-0.5">
                      {downloadingFormat === "csv" ? "..." : "Download"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 2: Schema info */}
              <div className="rounded-lg border border-line/70 bg-paper/25 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-caption font-semibold text-ink">
                    Required spreadsheet columns
                  </span>
                  <span className="text-caption text-ink-muted">
                    * required field
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center rounded bg-surface px-2 py-0.5 font-mono text-[0.75rem] text-ink border border-line/60">
                    email<span className="text-danger font-bold ml-0.5">*</span>
                  </span>
                  <span className="inline-flex items-center rounded bg-surface px-2 py-0.5 font-mono text-[0.75rem] text-ink border border-line/60">
                    password
                    <span className="text-danger font-bold ml-0.5">*</span>
                  </span>
                  <span className="inline-flex items-center rounded bg-surface px-2 py-0.5 font-mono text-[0.75rem] text-ink border border-line/60">
                    fullName
                    <span className="text-danger font-bold ml-0.5">*</span>
                  </span>
                  <span className="inline-flex items-center rounded bg-surface px-2 py-0.5 font-mono text-[0.75rem] text-ink border border-line/60">
                    phone<span className="text-danger font-bold ml-0.5">*</span>
                  </span>
                  <span className="inline-flex items-center rounded bg-surface px-2 py-0.5 font-mono text-[0.75rem] text-ink border border-line/60">
                    hubOrZone
                    <span className="text-danger font-bold ml-0.5">*</span>
                  </span>
                  <span className="inline-flex items-center rounded bg-surface px-2 py-0.5 font-mono text-[0.75rem] text-ink-muted border border-line/60">
                    vehicleType
                  </span>
                </div>
                <p className="text-caption text-ink-muted">
                  First row must contain column headers. Up to 200 agents per
                  upload.
                </p>
              </div>

              {/* Step 3: Upload dropzone */}
              <div className="space-y-1.5">
                <span className="text-caption font-semibold uppercase tracking-wider text-ink-muted block">
                  Step 2: Choose or drop your file
                </span>
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
                <div className="rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-body-sm font-medium text-danger">
                  {error}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-2.5 border-t border-line/60 pt-4">
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
                  className="gap-1.5"
                >
                  <Upload className="size-3.5" aria-hidden="true" />
                  Import agents
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div
                className={cn(
                  "rounded-lg border p-4 space-y-1",
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

              <div className="max-h-60 space-y-1.5 overflow-y-auto rounded-lg border border-line bg-paper/20 p-3 text-body-sm">
                {results.map((row) => (
                  <div
                    key={row.row}
                    className="flex items-center justify-between gap-3 rounded-md bg-surface p-2.5 text-caption font-mono border border-line/50"
                  >
                    <span className="truncate text-ink font-medium">
                      Row {row.row}: {row.email}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded px-1.5 py-0.5 font-sans font-semibold text-[0.6875rem]",
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

              <div className="flex items-center justify-end gap-2.5 border-t border-line/60 pt-4">
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

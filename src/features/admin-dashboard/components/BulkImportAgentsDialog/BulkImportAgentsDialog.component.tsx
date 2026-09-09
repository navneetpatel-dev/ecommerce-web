"use client";

import { useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { FilePicker } from "@/shared/components/FilePicker.component";
import { cn } from "@/shared/utils/cn";
import { useBulkImportAgents } from "../../hooks/useBulkImportAgents.hook";
import { MAX_FILE_BYTES, MAX_ROWS } from "../../utils/parseAgentsCsv";
import { TemplateDownloadCards } from "./TemplateDownloadCards.component";
import { ImportResultsPanel } from "./ImportResultsPanel.component";

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
  const {
    file,
    setFile,
    pending,
    downloadingFormat,
    error,
    setError,
    results,
    reset,
    handleDownloadTemplate,
    handleImport,
  } = useBulkImportAgents(onImported);

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
              <TemplateDownloadCards
                downloadingFormat={downloadingFormat}
                onDownload={(format) => void handleDownloadTemplate(format)}
              />

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
            <ImportResultsPanel
              results={results}
              onUploadAnother={reset}
              onDone={() => setOpen(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

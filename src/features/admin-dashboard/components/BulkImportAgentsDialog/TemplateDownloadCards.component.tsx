import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface TemplateDownloadCardsProps {
  downloadingFormat: "xlsx" | "csv" | null;
  onDownload: (format: "xlsx" | "csv") => void;
}

/** Step 1 of the bulk-import dialog: the two sample-template download cards. */
export function TemplateDownloadCards({
  downloadingFormat,
  onDownload,
}: TemplateDownloadCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-caption font-bold text-brand">
          1
        </span>
        <h4 className="text-body-sm font-semibold text-ink tracking-normal">
          Download sample template
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Excel Template Card */}
        <div className="flex flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-all hover:border-emerald-500/50 hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                <FileSpreadsheet className="size-5" aria-hidden="true" />
              </div>
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-caption font-bold text-emerald-600 dark:text-emerald-400">
                .xlsx
              </span>
            </div>
            <div className="mt-3 mb-4 space-y-1">
              <p className="text-body-sm font-semibold text-ink">
                Excel spreadsheet
              </p>
              <p className="text-caption text-ink-muted">
                Pre-formatted with columns & sample rows
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={Boolean(downloadingFormat)}
            onClick={() => onDownload("xlsx")}
            className="w-full gap-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white"
          >
            <Download className="size-3.5" aria-hidden="true" />
            <span>
              {downloadingFormat === "xlsx"
                ? "Downloading..."
                : "Download .xlsx sample"}
            </span>
          </Button>
        </div>

        {/* CSV Template Card */}
        <div className="flex flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-all hover:border-brand/50 hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-paper text-ink-muted border border-line">
                <FileText className="size-5" aria-hidden="true" />
              </div>
              <span className="rounded-md bg-paper px-2 py-0.5 text-caption font-semibold text-ink-muted border border-line/70">
                .csv
              </span>
            </div>
            <div className="mt-3 mb-4 space-y-1">
              <p className="text-body-sm font-semibold text-ink">CSV table</p>
              <p className="text-caption text-ink-muted">
                Plain-text comma-separated table
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={Boolean(downloadingFormat)}
            onClick={() => onDownload("csv")}
            className="w-full gap-2"
          >
            <Download className="size-3.5" aria-hidden="true" />
            <span>
              {downloadingFormat === "csv"
                ? "Downloading..."
                : "Download .csv sample"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

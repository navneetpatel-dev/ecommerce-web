import type { BulkCreateAgentResult } from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

interface ImportResultsPanelProps {
  results: BulkCreateAgentResult[];
  onUploadAnother: () => void;
  onDone: () => void;
}

/** Post-import results list + follow-up actions, shown after a bulk-import attempt. */
export function ImportResultsPanel({
  results,
  onUploadAnother,
  onDone,
}: ImportResultsPanelProps) {
  const successCount = results.filter((r) => r.success).length;

  return (
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
          {successCount} of {results.length} agent(s) were successfully created.
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
          onClick={onUploadAnother}
        >
          Upload another file
        </Button>
        <Button type="button" size="sm" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  );
}

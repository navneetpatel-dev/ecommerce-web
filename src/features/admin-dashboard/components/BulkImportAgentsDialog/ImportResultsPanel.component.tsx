import type { BulkCreateAgentResult } from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { bulkImportAgentsDialogStyles as styles } from "./bulkImportAgentsDialog.styles";

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
    <div className={styles.resultsContainer}>
      <div
        className={cn(
          styles.resultsBannerBase,
          successCount > 0
            ? styles.resultsBannerSuccess
            : styles.resultsBannerDanger,
        )}
      >
        <p className={styles.resultsBannerTitle}>
          {successCount > 0 ? "Import completed" : "Import failed"}
        </p>
        <p className={styles.resultsBannerSubtitle}>
          {successCount} of {results.length} agent(s) were successfully created.
        </p>
      </div>

      <div className={styles.resultsScrollBox}>
        {results.map((row) => (
          <div key={row.row} className={styles.resultsRow}>
            <span className={styles.resultsRowEmail}>
              Row {row.row}: {row.email}
            </span>
            <span
              className={cn(
                styles.resultsRowBadgeBase,
                row.success
                  ? styles.resultsRowBadgeSuccess
                  : styles.resultsRowBadgeDanger,
              )}
            >
              {row.success ? "Created" : (row.error ?? "Failed")}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.resultsFooter}>
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

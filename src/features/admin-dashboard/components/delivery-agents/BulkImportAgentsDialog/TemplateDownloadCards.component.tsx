import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { bulkImportAgentsDialogStyles as styles } from "../../../styles/delivery-agents/bulkImportAgentsDialog.styles";

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
    <div className={styles.stepContainer}>
      <div className={styles.stepHeadingRow}>
        <span className={styles.stepNumberBadge}>1</span>
        <h4 className={styles.stepHeadingText}>Download sample template</h4>
      </div>

      <div className={styles.cardsGrid}>
        {/* Excel Template Card */}
        <div className={styles.excelCard}>
          <div>
            <div className={styles.cardHeader}>
              <div className={styles.excelIconWrapper}>
                <FileSpreadsheet
                  className={styles.excelIcon}
                  aria-hidden="true"
                />
              </div>
              <span className={styles.excelBadge}>.xlsx</span>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardTitle}>Excel spreadsheet</p>
              <p className={styles.cardDescription}>
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
            className={styles.excelDownloadButton}
          >
            <Download className={styles.downloadIcon} aria-hidden="true" />
            <span>
              {downloadingFormat === "xlsx"
                ? "Downloading..."
                : "Download .xlsx sample"}
            </span>
          </Button>
        </div>

        {/* CSV Template Card */}
        <div className={styles.csvCard}>
          <div>
            <div className={styles.cardHeader}>
              <div className={styles.csvIconWrapper}>
                <FileText className={styles.csvIcon} aria-hidden="true" />
              </div>
              <span className={styles.csvBadge}>.csv</span>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardTitle}>CSV table</p>
              <p className={styles.cardDescription}>
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
            className={styles.csvDownloadButton}
          >
            <Download className={styles.downloadIcon} aria-hidden="true" />
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

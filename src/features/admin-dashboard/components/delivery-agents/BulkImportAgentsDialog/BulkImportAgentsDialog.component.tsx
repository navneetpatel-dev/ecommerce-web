"use client";

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
import { MAX_FILE_BYTES, MAX_ROWS } from "../../../utils/delivery-agents/parseAgentsCsv";
import { TemplateDownloadCards } from "./TemplateDownloadCards.component";
import { ImportResultsPanel } from "./ImportResultsPanel.component";
import { CsvParseErrorList } from "./CsvParseErrorList.component";
import { RequiredColumnsInfo } from "./RequiredColumnsInfo.component";
import { useBulkImportAgentsDialog } from "../../../hooks/delivery-agents/useBulkImportAgentsDialog.hook";
import { bulkImportAgentsDialogStyles as styles } from "../../../styles/delivery-agents/bulkImportAgentsDialog.styles";

interface BulkImportAgentsDialogProps {
  onImported: () => void;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost";
  triggerClassName?: string;
}

export function BulkImportAgentsDialog({
  onImported,
  triggerVariant = "outline",
  triggerClassName,
}: BulkImportAgentsDialogProps) {
  const {
    open,
    file,
    pending,
    downloadingFormat,
    error,
    parseErrors,
    results,
    reset,
    handleOpenChange,
    handleClose,
    handleFileChange,
    handleDownload,
    handleImportClick,
  } = useBulkImportAgentsDialog({ onImported });

  const errorBanner = error ? (
    <div className={styles.errorBanner}>{error}</div>
  ) : (
    <CsvParseErrorList errors={parseErrors} />
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          size="sm"
          className={styles.triggerButton(triggerClassName)}
        >
          <FileSpreadsheet className={styles.triggerIcon} aria-hidden="true" />
          <span>Bulk import</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.header}>
          <div className={styles.headerRow}>
            <div className={styles.headerIconWrapper}>
              <FileSpreadsheet
                className={styles.headerIcon}
                aria-hidden="true"
              />
            </div>
            <div className={styles.headerTextWrapper}>
              <DialogTitle className={styles.title}>
                Bulk import delivery agents
              </DialogTitle>
              <p className={styles.subtitle}>
                Quickly onboard multiple field agents at once using an Excel
                (.xlsx) or CSV template.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className={styles.body}>
          {!results ? (
            <>
              <TemplateDownloadCards
                downloadingFormat={downloadingFormat}
                onDownload={handleDownload}
              />

              <RequiredColumnsInfo />

              <div className={styles.uploadStepContainer}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>2</span>
                  <h4 className={styles.stepTitle}>Choose or drop your file</h4>
                </div>
                <FilePicker
                  accept=".csv,text/csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  maxBytes={MAX_FILE_BYTES}
                  maxRows={MAX_ROWS}
                  value={file}
                  onChange={handleFileChange}
                  disabled={pending}
                  hint="Excel (.xlsx) or CSV format • Max 2 MB • Up to 200 rows"
                />
              </div>

              {errorBanner}

              <div className={styles.actionsRow}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!file || pending}
                  loading={pending}
                  onClick={handleImportClick}
                  className={styles.importButton}
                >
                  <Upload className={styles.importIcon} aria-hidden="true" />
                  Import agents
                </Button>
              </div>
            </>
          ) : (
            <ImportResultsPanel
              results={results}
              onUploadAnother={reset}
              onDone={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

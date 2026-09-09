"use client";

import { Button } from "@/shared/components/ui/button";
import { FilePicker } from "@/shared/components/FilePicker.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { vendorBulkImportDialogStyles } from "../../styles/products/vendorDialogs.styles";
import { useVendorBulkImportDialog } from "../../hooks/products/useVendorBulkImportDialog.hook";
import { VendorBulkImportResultsTable } from "./VendorBulkImportResultsTable.component";

interface VendorBulkImportDialogProps {
  onImported?: () => void;
}

/** Vendor CSV bulk product import: file picker → per-row success/failure report. */
export function VendorBulkImportDialog({
  onImported,
}: VendorBulkImportDialogProps) {
  const {
    open,
    setOpen,
    file,
    importing,
    error,
    results,
    successCount,
    close,
    onFileChange,
    submit,
  } = useVendorBulkImportDialog(onImported);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        {LABELS.bulkImportProducts}
      </Button>

      <StatusDialog
        open={open}
        onOpenChange={(next) => {
          if (!next) close();
        }}
        variant="info"
        title={LABELS.bulkImportDialogTitle}
        description={LABELS.bulkImportDialogHint}
        secondaryAction={{
          label: results ? LABELS.bulkImportClose : LABELS.cancel,
          disabled: importing,
          onClick: close,
        }}
        primaryAction={
          results
            ? undefined
            : {
                label: importing
                  ? LABELS.bulkImportImporting
                  : LABELS.bulkImportSubmit,
                loading: importing,
                disabled: !file,
                onClick: () => void submit(),
              }
        }
      >
        {!results ? (
          <div className={vendorBulkImportDialogStyles.stack}>
            <FilePicker
              accept=".csv,text/csv"
              maxBytes={2 * 1024 * 1024}
              maxRows={500}
              value={file}
              onChange={onFileChange}
              disabled={importing}
              hint="CSV format • Max 2 MB • Up to 500 rows"
            />
            {error ? (
              <p className={vendorBulkImportDialogStyles.errorMessage}>
                {error}
              </p>
            ) : null}
          </div>
        ) : (
          <VendorBulkImportResultsTable
            results={results}
            successCount={successCount}
          />
        )}
        {error ? (
          <p className={vendorBulkImportDialogStyles.errorMessage}>{error}</p>
        ) : null}
      </StatusDialog>
    </>
  );
}

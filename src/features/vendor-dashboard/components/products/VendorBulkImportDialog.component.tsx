"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { FilePicker } from "@/shared/components/FilePicker.component";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { productsApi, type BulkImportRowResult } from "@/features/products";
import { vendorBulkImportDialogStyles } from "./vendorDialogs.styles";

interface VendorBulkImportDialogProps {
  onImported?: () => void;
}

/** Vendor CSV bulk product import: file picker → per-row success/failure report. */
export function VendorBulkImportDialog({
  onImported,
}: VendorBulkImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BulkImportRowResult[] | null>(null);

  const close = () => {
    if (importing) return;
    setOpen(false);
    setFile(null);
    setError(null);
    setResults(null);
  };

  const submit = async () => {
    if (!file) {
      setError(LABELS.bulkImportNoFile);
      return;
    }
    setImporting(true);
    setError(null);
    try {
      const rows = await productsApi.bulkImport(file);
      setResults(rows);
      if (rows.some((row) => row.success)) onImported?.();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.bulkImportFailed));
    } finally {
      setImporting(false);
    }
  };

  const successCount = results?.filter((row) => row.success).length ?? 0;

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
              onChange={(f) => {
                setFile(f);
                setError(null);
              }}
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
          <div className={vendorBulkImportDialogStyles.stack}>
            <p className={vendorBulkImportDialogStyles.summaryText}>
              {formatLabel(LABELS.bulkImportSummary, {
                success: successCount,
                total: results.length,
              })}
            </p>
            <TableScrollShell>
              <Table scrollContainer={false}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{LABELS.bulkImportRowColumn}</TableHead>
                    <TableHead>{LABELS.bulkImportStatusColumn}</TableHead>
                    <TableHead>{LABELS.bulkImportDetailColumn}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((row) => (
                    <TableRow key={row.row}>
                      <TableCell
                        className={vendorBulkImportDialogStyles.rowCell}
                      >
                        {row.row}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={row.success ? "success" : "destructive"}
                        >
                          {row.success
                            ? LABELS.bulkImportRowSuccess
                            : LABELS.bulkImportRowFailed}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={vendorBulkImportDialogStyles.detailCell}
                      >
                        {row.success ? row.productId : row.error}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableScrollShell>
          </div>
        )}
        {error ? (
          <p className={vendorBulkImportDialogStyles.errorMessage}>{error}</p>
        ) : null}
      </StatusDialog>
    </>
  );
}

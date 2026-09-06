"use client";

import { useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
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
import { formatLabel } from "@/shared/utils/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { productsApi, type BulkImportRowResult } from "@/features/products";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    if (importing) return;
    setOpen(false);
    setFile(null);
    setError(null);
    setResults(null);
    if (inputRef.current) inputRef.current.value = "";
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
          <Input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        ) : (
          <div className="space-y-3">
            <p className="text-body-sm text-ink">
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
                      <TableCell className="font-mono">{row.row}</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.success ? "success" : "destructive"}
                        >
                          {row.success
                            ? LABELS.bulkImportRowSuccess
                            : LABELS.bulkImportRowFailed}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-body-sm text-ink-muted">
                        {row.success ? row.productId : row.error}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableScrollShell>
          </div>
        )}
        {error ? <p className="text-body-sm text-danger">{error}</p> : null}
      </StatusDialog>
    </>
  );
}

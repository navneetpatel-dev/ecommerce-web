"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { productsApi, type BulkImportRowResult } from "@/features/products";

export function useVendorBulkImportDialog(onImported?: () => void) {
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

  const onFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    setError(null);
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

  return {
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
  };
}

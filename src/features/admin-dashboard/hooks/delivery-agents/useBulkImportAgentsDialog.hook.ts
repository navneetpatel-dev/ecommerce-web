"use client";

import { useState } from "react";
import { useBulkImportAgents } from "./useBulkImportAgents.hook";

interface UseBulkImportAgentsDialogParams {
  onImported: () => void;
}

export function useBulkImportAgentsDialog({
  onImported,
}: UseBulkImportAgentsDialogParams) {
  const [open, setOpen] = useState(false);
  const {
    file,
    setFile,
    pending,
    downloadingFormat,
    error,
    setError,
    parseErrors,
    setParseErrors,
    results,
    reset,
    handleDownloadTemplate,
    handleImport,
  } = useBulkImportAgents(onImported);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (f: File | null) => {
    setFile(f);
    setError(null);
    setParseErrors([]);
  };

  const handleDownload = (format: "xlsx" | "csv") => {
    void handleDownloadTemplate(format);
  };

  const handleImportClick = () => {
    void handleImport();
  };

  return {
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
  };
}

"use client";

import { useState } from "react";
import {
  deliveryAdminApi,
  type BulkCreateAgentResult,
} from "@/features/delivery-dashboard";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { parseAgentsCsv } from "../../utils/delivery-agents/parseAgentsCsv";

/** Owns the bulk-agent-import dialog's file/upload/template-download state. */
export function useBulkImportAgents(onImported: () => void) {
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<
    "xlsx" | "csv" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BulkCreateAgentResult[] | null>(null);

  const reset = () => {
    setFile(null);
    setError(null);
    setResults(null);
    setDownloadingFormat(null);
  };

  const handleDownloadTemplate = async (format: "xlsx" | "csv") => {
    setDownloadingFormat(format);
    try {
      await deliveryAdminApi.downloadBulkTemplate(format);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not download sample template."));
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please choose an Excel or CSV file to import.");
      return;
    }
    setError(null);
    setResults(null);
    setPending(true);

    try {
      const isXlsx =
        file.name.endsWith(".xlsx") ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (isXlsx) {
        // Upload Excel file directly to backend parser
        const rowResults = await deliveryAdminApi.bulkImportFile(file);
        setResults(rowResults);
        if (rowResults.some((row) => row.success)) onImported();
      } else {
        // Parse CSV client-side with fast feedback, then bulkCreate
        const text = await file.text();
        const { rows, error: parseError } = parseAgentsCsv(text);
        if (parseError) {
          setError(parseError);
          setPending(false);
          return;
        }
        const rowResults = await deliveryAdminApi.bulkCreate(rows);
        setResults(rowResults);
        if (rowResults.some((row) => row.success)) onImported();
      }
    } catch (importError) {
      setError(getApiErrorMessage(importError, "Could not import agents."));
    } finally {
      setPending(false);
    }
  };

  return {
    file,
    setFile,
    pending,
    downloadingFormat,
    error,
    setError,
    results,
    reset,
    handleDownloadTemplate,
    handleImport,
  };
}

"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { adminApi } from "../api/admin.api";

export function AdminAnalyticsExportBar() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (format: "xlsx" | "csv" | "pdf") => {
    setExporting(true);
    setError(null);
    try {
      await adminApi.exportAnalytics(format);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-2">
      <ButtonGroup align="start">
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={exporting}
          onClick={() => void run("xlsx")}
        >
          <Download className="h-4 w-4" aria-hidden />
          {LABELS.exportExcel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={exporting}
          onClick={() => void run("csv")}
        >
          {LABELS.exportCsv}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={exporting}
          onClick={() => void run("pdf")}
        >
          {LABELS.exportPdf}
        </Button>
      </ButtonGroup>
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </div>
  );
}

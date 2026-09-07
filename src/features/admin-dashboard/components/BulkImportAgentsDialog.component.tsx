"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import {
  deliveryAdminApi,
  type BulkCreateAgentResult,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { FilePicker } from "@/shared/components/FilePicker.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

const EXPECTED_COLUMNS = [
  "email",
  "password",
  "fullName",
  "phone",
  "vehicleType",
  "hubOrZone",
] as const;

const MAX_ROWS = 200;
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB

interface ParsedRow {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  hubOrZone: string;
}

/**
 * Minimal CSV parser for a fixed, simple column set (no library — this app has no CSV
 * import precedent, and agent onboarding data is not expected to contain embedded commas
 * or quoted fields).
 */
function parseAgentsCsv(text: string): {
  rows: ParsedRow[];
  error: string | null;
} {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      rows: [],
      error: "CSV must have a header row and at least one data row.",
    };
  }
  if (lines.length - 1 > MAX_ROWS) {
    return {
      rows: [],
      error: `CSV file exceeds the ${MAX_ROWS}-row limit (found ${lines.length - 1} rows).`,
    };
  }
  const header = lines[0].split(",").map((cell) => cell.trim());
  const missing = EXPECTED_COLUMNS.filter((col) => !header.includes(col));
  if (missing.length > 0) {
    return { rows: [], error: `Missing column(s): ${missing.join(", ")}` };
  }

  const rows: ParsedRow[] = lines.slice(1).map((line) => {
    const cells = line.split(",").map((cell) => cell.trim());
    const record: Record<string, string> = {};
    header.forEach((col, index) => {
      record[col] = cells[index] ?? "";
    });
    return {
      email: record.email,
      password: record.password,
      fullName: record.fullName,
      phone: record.phone,
      vehicleType: record.vehicleType || "BIKE",
      hubOrZone: record.hubOrZone,
    };
  });

  return { rows, error: null };
}

export function BulkImportAgentsDialog({
  onImported,
}: {
  onImported: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BulkCreateAgentResult[] | null>(null);

  const reset = () => {
    setFile(null);
    setError(null);
    setResults(null);
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please choose a CSV file to import.");
      return;
    }
    setError(null);
    setResults(null);
    setPending(true);

    try {
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
    } catch (importError) {
      setError(getApiErrorMessage(importError, "Could not import agents."));
    } finally {
      setPending(false);
    }
  };

  const successCount = results?.filter((r) => r.success).length ?? 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Upload className="size-3.5" aria-hidden="true" />
          Bulk import (CSV)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk import agents</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-line bg-paper/30 p-3 space-y-1.5 text-body-sm">
            <p className="font-medium text-ink">Required CSV Columns:</p>
            <code className="block rounded bg-surface px-2 py-1 font-mono text-caption text-ink break-all border border-line/60">
              {EXPECTED_COLUMNS.join(", ")}
            </code>
            <p className="text-caption text-ink-muted">
              First row must be the header. Maximum 200 agents per upload.
            </p>
          </div>

          {!results ? (
            <>
              <FilePicker
                accept=".csv,text/csv"
                maxBytes={MAX_FILE_BYTES}
                maxRows={MAX_ROWS}
                value={file}
                onChange={(f) => {
                  setFile(f);
                  setError(null);
                }}
                disabled={pending}
                hint="CSV format • Max 2 MB • Up to 200 rows"
              />

              {error ? (
                <p className="text-body-sm text-danger">{error}</p>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!file || pending}
                  loading={pending}
                  onClick={() => void handleImport()}
                >
                  Import agents
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-body-sm">
                <p className="font-medium text-ink">
                  Import Summary: {successCount} of {results.length} succeeded
                </p>
              </div>
              <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-md border border-line p-3 text-body-sm">
                {results.map((row) => (
                  <div
                    key={row.row}
                    className="flex items-center justify-between gap-2 text-caption font-mono"
                  >
                    <span className="text-ink">
                      Row {row.row} ({row.email})
                    </span>
                    <span
                      className={
                        row.success ? "text-success font-medium" : "text-danger"
                      }
                    >
                      {row.success ? "Created" : row.error}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={reset}
                >
                  Upload another file
                </Button>
                <Button type="button" size="sm" onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

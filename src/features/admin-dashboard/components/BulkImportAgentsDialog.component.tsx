"use client";

import { useRef, useState } from "react";
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
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

const EXPECTED_COLUMNS = [
  "email",
  "password",
  "fullName",
  "phone",
  "vehicleType",
  "hubOrZone",
] as const;

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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BulkCreateAgentResult[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setResults(null);
    const text = await file.text();
    const { rows, error: parseError } = parseAgentsCsv(text);
    if (parseError) {
      setError(parseError);
      return;
    }
    setPending(true);
    try {
      const rowResults = await deliveryAdminApi.bulkCreate(rows);
      setResults(rowResults);
      if (rowResults.some((row) => row.success)) onImported();
    } catch (importError) {
      setError(getApiErrorMessage(importError, "Could not import agents."));
    } finally {
      setPending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setResults(null);
          setError(null);
        }
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
        <div className="space-y-3">
          <p className="text-body-sm text-ink-muted">
            CSV columns: <code>{EXPECTED_COLUMNS.join(",")}</code>. First row
            must be the header. Up to 200 rows per file.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            disabled={pending}
            onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
            className="block w-full text-body-sm"
          />
          {error ? <p className="text-body-sm text-danger">{error}</p> : null}
          {results ? (
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-line p-2 text-body-sm">
              {results.map((row) => (
                <p
                  key={row.row}
                  className={row.success ? "text-success" : "text-danger"}
                >
                  Row {row.row} ({row.email}):{" "}
                  {row.success ? "created" : row.error}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

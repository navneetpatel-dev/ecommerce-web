"use client";

import { Gauge } from "lucide-react";
import { useAdminWebVitalsPage } from "../hooks/useAdminWebVitalsPage.hook";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import type { WebVitalSummaryRow } from "../api/webVitals.api";
import { webVitalsReportLabels as LABELS } from "@/shared/constants/labels/webVitalsReport";

/** CLS is ingested scaled by 1000 (see web/src/shared/utils/webVitals.ts); undo that for display. */
function displayValue(name: string, value: number): string {
  if (name === "CLS") return (value / 1000).toFixed(3);
  return `${Math.round(value)} ms`;
}

export function AdminWebVitalsPage() {
  const page = useAdminWebVitalsPage();

  const columns: DataTableColumn<WebVitalSummaryRow>[] = [
    {
      id: "metric",
      header: LABELS.webVitalsColMetric,
      className: "font-mono font-medium text-ink",
      cell: (row) => row.name,
    },
    {
      id: "page",
      header: LABELS.webVitalsColPage,
      className: "text-ink-muted",
      truncate: false,
      cell: (row) => row.path,
    },
    {
      id: "p75",
      header: LABELS.webVitalsColP75,
      className: "font-medium text-ink",
      cell: (row) => displayValue(row.name, row.p75),
    },
    {
      id: "samples",
      header: LABELS.webVitalsColSamples,
      className: "text-ink-muted",
      cell: (row) => row.sampleCount,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <Gauge className="size-5 text-brand" aria-hidden="true" />
          <h1 className="font-display text-[1.5rem] tracking-tight text-ink">
            {LABELS.webVitals}
          </h1>
        </div>
        <p className="max-w-2xl text-body-sm text-ink-muted">
          {LABELS.webVitalsHint}
        </p>
      </header>

      <div className="rounded-md border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-end gap-4">
          <DateRangeFields
            from={page.from}
            to={page.to}
            onFromChange={page.setFrom}
            onToChange={page.setTo}
            fromId="web-vitals-from"
            toId="web-vitals-to"
            fromClassName="w-full sm:w-44 lg:w-48"
            toClassName="w-full sm:w-44 lg:w-48"
          />
          <FormFieldFrame
            label={LABELS.webVitalsPathFilterLabel}
            htmlFor="web-vitals-path"
            className="flex-1 min-w-[16rem]"
          >
            <Input
              id="web-vitals-path"
              value={page.path}
              onChange={(e) => page.setPath(e.target.value)}
              placeholder={LABELS.webVitalsPathFilterPlaceholder}
            />
          </FormFieldFrame>
          <div className="w-full sm:w-auto">
            <Button
              type="button"
              loading={page.loading}
              onClick={page.reload}
              className="w-full sm:w-auto h-11 px-6 font-medium"
            >
              {LABELS.webVitalsLoad}
            </Button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={page.rows}
        loading={page.loading}
        error={page.error}
        emptyMessage={LABELS.webVitalsEmpty}
        getRowId={(row) => `${row.name}:${row.path}`}
        rowDetails={false}
      />
    </div>
  );
}

"use client";

import { Gauge } from "lucide-react";
import { useAdminWebVitalsPage } from "../hooks/useAdminWebVitalsPage.hook";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { webVitalsReportLabels as LABELS } from "@/shared/constants/labels/webVitalsReport";

/** CLS is ingested scaled by 1000 (see web/src/shared/utils/webVitals.ts); undo that for display. */
function displayValue(name: string, value: number): string {
  if (name === "CLS") return (value / 1000).toFixed(3);
  return `${Math.round(value)} ms`;
}

export function AdminWebVitalsPage() {
  const page = useAdminWebVitalsPage();
  const hasRows = page.rows.length > 0;

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

      <div className="flex flex-wrap items-end gap-3">
        <DateRangeFields
          from={page.from}
          to={page.to}
          onFromChange={page.setFrom}
          onToChange={page.setTo}
          fromId="web-vitals-from"
          toId="web-vitals-to"
        />
        <FormFieldFrame
          label={LABELS.webVitalsPathFilterLabel}
          htmlFor="web-vitals-path"
        >
          <Input
            id="web-vitals-path"
            value={page.path}
            onChange={(e) => page.setPath(e.target.value)}
            placeholder={LABELS.webVitalsPathFilterPlaceholder}
            className="min-w-[16rem]"
          />
        </FormFieldFrame>
        <Button
          type="button"
          size="sm"
          loading={page.loading}
          onClick={page.reload}
        >
          {LABELS.webVitalsLoad}
        </Button>
      </div>

      {page.loading ? (
        <p className="text-body-sm text-ink-muted">{LABELS.webVitalsLoading}</p>
      ) : page.error ? (
        <p className="text-body-sm text-danger">{page.error}</p>
      ) : !hasRows ? (
        <p className="text-body-sm text-ink-muted">{LABELS.webVitalsEmpty}</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[640px] text-body-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-left text-ink-muted">
                <th className="py-2 pl-3 pr-3 font-medium">
                  {LABELS.webVitalsColMetric}
                </th>
                <th className="py-2 pr-3 font-medium">
                  {LABELS.webVitalsColPage}
                </th>
                <th className="py-2 pr-3 font-medium">
                  {LABELS.webVitalsColP75}
                </th>
                <th className="py-2 pr-3 font-medium">
                  {LABELS.webVitalsColSamples}
                </th>
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row) => (
                <tr
                  key={`${row.name}:${row.path}`}
                  className="border-b border-line/60"
                >
                  <td className="py-2 pl-3 pr-3 font-mono">{row.name}</td>
                  <td className="py-2 pr-3 text-ink-muted">{row.path}</td>
                  <td className="py-2 pr-3">
                    {displayValue(row.name, row.p75)}
                  </td>
                  <td className="py-2 pr-3">{row.sampleCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

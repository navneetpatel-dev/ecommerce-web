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

      {page.loading ? (
        <p className="text-body-sm text-ink-muted">{LABELS.webVitalsLoading}</p>
      ) : page.error ? (
        <p className="text-body-sm text-danger">{page.error}</p>
      ) : !hasRows ? (
        <p className="text-body-sm text-ink-muted">{LABELS.webVitalsEmpty}</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-line bg-surface">
          <table className="w-full min-w-[640px] text-body-sm">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left text-ink-muted">
                <th className="py-3 px-4 font-medium">
                  {LABELS.webVitalsColMetric}
                </th>
                <th className="py-3 px-4 font-medium">
                  {LABELS.webVitalsColPage}
                </th>
                <th className="py-3 px-4 font-medium">
                  {LABELS.webVitalsColP75}
                </th>
                <th className="py-3 px-4 font-medium">
                  {LABELS.webVitalsColSamples}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {page.rows.map((row) => (
                <tr
                  key={`${row.name}:${row.path}`}
                  className="hover:bg-paper/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-medium text-ink">
                    {row.name}
                  </td>
                  <td className="py-3 px-4 text-ink-muted">{row.path}</td>
                  <td className="py-3 px-4 font-medium text-ink">
                    {displayValue(row.name, row.p75)}
                  </td>
                  <td className="py-3 px-4 text-ink-muted">
                    {row.sampleCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

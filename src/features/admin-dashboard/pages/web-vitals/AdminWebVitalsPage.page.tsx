"use client";

import { Gauge } from "lucide-react";
import { useAdminWebVitalsPage } from "../../hooks/web-vitals/useAdminWebVitalsPage.hook";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import type { WebVitalSummaryRow } from "../../api/web-vitals/webVitals.api";
import { webVitalsReportLabels as LABELS } from "@/shared/constants/labels/webVitalsReport";
import { adminPagesStyles } from "../shared/adminPages.styles";

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
      className: adminPagesStyles.colMetric,
      cell: (row) => row.name,
    },
    {
      id: "page",
      header: LABELS.webVitalsColPage,
      className: adminPagesStyles.colMuted,
      truncate: false,
      cell: (row) => row.path,
    },
    {
      id: "p75",
      header: LABELS.webVitalsColP75,
      className: adminPagesStyles.colInkMedium,
      cell: (row) => displayValue(row.name, row.p75),
    },
    {
      id: "samples",
      header: LABELS.webVitalsColSamples,
      className: adminPagesStyles.colMuted,
      cell: (row) => row.sampleCount,
    },
  ];

  return (
    <div className={adminPagesStyles.stack6}>
      <header className={adminPagesStyles.stack1}>
        <div className={adminPagesStyles.flexGap2}>
          <Gauge className={adminPagesStyles.iconBrandMd} aria-hidden="true" />
          <h1 className={adminPagesStyles.pageHeadingLg}>{LABELS.webVitals}</h1>
        </div>
        <p className={adminPagesStyles.hintMax2xl}>{LABELS.webVitalsHint}</p>
      </header>

      <div className={adminPagesStyles.cardSurface}>
        <div className={adminPagesStyles.filterRow}>
          <DateRangeFields
            from={page.from}
            to={page.to}
            onFromChange={page.setFrom}
            onToChange={page.setTo}
            fromId="web-vitals-from"
            toId="web-vitals-to"
            fromClassName={adminPagesStyles.dateRangeInput}
            toClassName={adminPagesStyles.dateRangeInput}
          />
          <FormFieldFrame
            label={LABELS.webVitalsPathFilterLabel}
            htmlFor="web-vitals-path"
            className={adminPagesStyles.fieldFlex1MinW}
          >
            <Input
              id="web-vitals-path"
              value={page.path}
              onChange={(e) => page.setPath(e.target.value)}
              placeholder={LABELS.webVitalsPathFilterPlaceholder}
            />
          </FormFieldFrame>
          <div className={adminPagesStyles.wFullSmAuto}>
            <Button
              type="button"
              loading={page.loading}
              onClick={page.reload}
              className={adminPagesStyles.actionButtonH11}
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

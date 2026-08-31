"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { ReportFilterBar } from "../components/ReportFilterBar.component";
import { ReportTable } from "../components/ReportTable.component";
import { useReportHub } from "../hooks/useReportHub.hook";

export function VendorReportsPage() {
  const hub = useReportHub({ preferAudience: "vendor" });

  if (hub.catalogError) {
    return (
      <div className="border border-line bg-surface px-5 py-10 text-center">
        <p className="text-body text-danger">{hub.catalogError}</p>
        <button
          type="button"
          onClick={hub.onRetryCatalog}
          className="mt-2 text-[0.875rem] font-medium text-brand underline-offset-4 hover:underline"
        >
          {LABELS.retry}
        </button>
      </div>
    );
  }

  return (
    <RequirePermission
      permission={[
        PERMISSIONS.PAYOUT_VIEW,
        PERMISSIONS.SUBORDER_MANAGE,
        PERMISSIONS.PRODUCT_UPDATE,
      ]}
    >
      <div className="w-full min-w-0 space-y-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.reports}
          </h2>
          <p className="max-w-3xl text-body text-ink-muted">
            {LABELS.reportsHubHint}
          </p>
        </div>

        <ReportFilterBar
          catalog={hub.catalog}
          reportType={hub.reportType}
          onReportTypeChange={hub.setReportType}
          labelForKey={hub.labelForKey}
          from={hub.from}
          to={hub.to}
          onFromChange={hub.setFrom}
          onToChange={hub.setTo}
          vendorId={hub.vendorId}
          onVendorIdChange={hub.setVendorId}
          showVendorFilter={false}
          categoryId={hub.categoryId}
          onCategoryIdChange={hub.setCategoryId}
          status={hub.status}
          onStatusChange={hub.setStatus}
          onLoad={() => hub.load(1)}
          onExportExcel={hub.exportExcel}
          onExportCsv={hub.exportCsv}
          onExportPdf={hub.exportPdf}
          loading={hub.loading}
          exporting={hub.exporting}
        />

        {hub.message ? (
          <p className="text-[0.875rem] text-ink-muted" aria-live="polite">
            {hub.message}
          </p>
        ) : null}

        <ReportTable
          onRetry={() => hub.load()}
          result={hub.result}
          loading={hub.loading}
          error={hub.error}
          onPageChange={hub.setPage}
        />
      </div>
    </RequirePermission>
  );
}

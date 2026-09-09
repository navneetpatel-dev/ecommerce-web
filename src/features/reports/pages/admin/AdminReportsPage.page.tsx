"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { ReportFilterBar } from "../../components/filters/ReportFilterBar.component";
import { ReportTable } from "../../components/table/ReportTable.component";
import { useReportHub } from "../../hooks/table/useReportHub.hook";
import { reportsPageStyles as styles } from "./reportsPage.styles";

export function AdminReportsPage() {
  const hub = useReportHub();

  if (hub.catalogError) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{hub.catalogError}</p>
        <button
          type="button"
          onClick={hub.onRetryCatalog}
          className={styles.retryButton}
        >
          {LABELS.retry}
        </button>
      </div>
    );
  }

  return (
    <RequirePermission
      permission={[
        PERMISSIONS.COMMISSION_VIEW,
        PERMISSIONS.ORDER_MANAGE,
        PERMISSIONS.PRODUCT_MANAGE,
        PERMISSIONS.CATEGORY_MANAGE,
        PERMISSIONS.PRODUCT_APPROVE,
        PERMISSIONS.REVIEW_MODERATE,
        PERMISSIONS.AUDIT_VIEW,
      ]}
    >
      <div className={styles.pageContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>{LABELS.reports}</h2>
          <p className={styles.description}>{LABELS.reportsHubHint}</p>
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
          showVendorFilter={!hub.selected?.vendorScoped}
          categoryId={hub.categoryId}
          onCategoryIdChange={hub.setCategoryId}
          status={hub.status}
          onStatusChange={hub.setStatus}
          onLoad={() => hub.load(1)}
          onExportExcel={hub.exportExcel}
          onExportCsv={hub.exportCsv}
          onExportPdf={hub.exportPdf}
          loading={hub.loading}
          controlsDisabled={hub.controlsDisabled}
          exportingFormat={hub.exportingFormat}
          message={hub.message}
          error={hub.error}
        />

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

"use client";

import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { ReportFilterBar } from "../../components/filters/ReportFilterBar.component";
import { ReportTable } from "../../components/table/ReportTable.component";
import { useReportHub } from "../../hooks/table/useReportHub.hook";
import { reportsPageStyles as styles } from "./reportsPage.styles";

export function AdminReportsPage() {
  const hub = useReportHub();

  const handleLoad = () => void hub.load(1);
  const handleRetry = () => void hub.load();

  if (hub.catalogError) {
    return (
      <div role="alert" className={styles.errorContainer}>
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
          <h1 className={styles.title}>{LABELS.reports}</h1>
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
          onLoad={handleLoad}
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
          onRetry={handleRetry}
          result={hub.result}
          loading={hub.loading}
          error={hub.error}
          onPageChange={hub.setPage}
        />
      </div>
    </RequirePermission>
  );
}

"use client";

import { ReportExportButtons, ReportExportStatus } from "@/features/reports";
import { useAdminAnalyticsExportBar } from "./AdminAnalyticsExportBar/useAdminAnalyticsExportBar.hook";
import { adminAnalyticsExportBarStyles as styles } from "./AdminAnalyticsExportBar/adminAnalyticsExportBar.styles";

interface AdminAnalyticsExportBarProps {
  range?: { from?: string; to?: string };
}

export function AdminAnalyticsExportBar({
  range,
}: AdminAnalyticsExportBarProps) {
  const {
    exportingFormat,
    error,
    message,
    controlsDisabled,
    handleExportExcel,
    handleExportCsv,
    handleExportPdf,
  } = useAdminAnalyticsExportBar({ range });

  return (
    <div className={styles.container}>
      <ReportExportButtons
        size="sm"
        controlsDisabled={controlsDisabled}
        exportingFormat={exportingFormat}
        statusMessage={message}
        onExportExcel={handleExportExcel}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
      />
      <ReportExportStatus
        message={message}
        error={error}
        exportingFormat={exportingFormat}
        controlsDisabled={controlsDisabled}
      />
    </div>
  );
}

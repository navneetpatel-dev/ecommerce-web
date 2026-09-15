"use client";

import { ExportJobsTray } from "@/shared/components/exports/ExportJobsTray.component";
import { useExportJobsTray } from "@/shared/hooks/exports/useExportJobsTray.hook";
import { useExportJobsWatcher } from "@/shared/hooks/exports/useExportJobsWatcher.hook";
import { useRecoverExportJobs } from "@/shared/hooks/exports/useRecoverExportJobs.hook";

export function ExportJobsTrayContainer() {
  useRecoverExportJobs();
  useExportJobsWatcher();
  const {
    activeJobs,
    recentJobs,
    handleDismiss,
    handleDownload,
    handleCancel,
  } = useExportJobsTray();
  return (
    <ExportJobsTray
      jobs={[...activeJobs, ...recentJobs]}
      onDismiss={handleDismiss}
      onDownload={handleDownload}
      onCancel={handleCancel}
    />
  );
}

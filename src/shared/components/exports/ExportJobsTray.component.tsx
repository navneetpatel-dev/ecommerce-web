"use client";

import { ExportJobsList } from "./ExportJobsList.component";
import { LABELS } from "@/shared/constants/labels";
import { exportJobsTrayStyles as styles } from "@/shared/styles/exports/exportJobsTray.styles";
import type { TrackedExportJob } from "@/shared/stores/exports/exportJobs.store";

interface ExportJobsTrayProps {
  jobs: TrackedExportJob[];
  onDismiss: (jobId: string) => void;
  onDownload: (jobId: string) => void;
  onCancel: (jobId: string) => void;
}

export function ExportJobsTray({
  jobs,
  onDismiss,
  onDownload,
  onCancel,
}: ExportJobsTrayProps) {
  if (jobs.length === 0) return null;
  return (
    <div className={styles.container}>
      <span className={styles.trayHeader}>{LABELS.exportTrayTitle}</span>
      <ExportJobsList
        jobs={jobs}
        onDismiss={onDismiss}
        onDownload={onDownload}
        onCancel={onCancel}
      />
    </div>
  );
}

"use client";

import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { LABELS } from "@/shared/constants/labels";
import { exportJobsTrayStyles as styles } from "@/shared/styles/exports/exportJobsTray.styles";
import {
  resolveExportJobStatusMessage,
  resolveExportJobErrorText,
} from "@/shared/utils/exports/exportJobStatusMessage";
import type { TrackedExportJob } from "@/shared/stores/exports/exportJobs.store";

interface ExportJobRowProps {
  job: TrackedExportJob;
  onDismiss: (jobId: string) => void;
  onDownload: (jobId: string) => void;
  onCancel: (jobId: string) => void;
}

export function ExportJobRow({
  job,
  onDismiss,
  onDownload,
  onCancel,
}: ExportJobRowProps) {
  const statusMessage = resolveExportJobStatusMessage(job);
  const errorText = resolveExportJobErrorText(job);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{job.label}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(job.jobId)}
        >
          {LABELS.exportDismissAction}
        </Button>
      </div>
      {statusMessage ? (
        <span className={styles.meta} aria-live="polite">
          {statusMessage}
        </span>
      ) : null}
      {job.status === "PROCESSING" || job.status === "QUEUED" ? (
        <div className={styles.progressRow}>
          <Progress
            value={job.progressPercent}
            indeterminate={job.progressPercent === 0}
          />
        </div>
      ) : null}
      {job.status === "QUEUED" ? (
        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onCancel(job.jobId)}
          >
            {LABELS.exportCancelAction}
          </Button>
        </div>
      ) : null}
      {job.status === "COMPLETED" ? (
        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDownload(job.jobId)}
          >
            {LABELS.exportDownloadAction}
          </Button>
        </div>
      ) : null}
      {errorText ? (
        <p className={styles.errorText} role="alert" aria-live="polite">
          {errorText}
        </p>
      ) : null}
    </div>
  );
}

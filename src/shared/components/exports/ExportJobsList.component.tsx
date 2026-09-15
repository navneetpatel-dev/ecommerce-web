"use client";

import { ExportJobRow } from "./ExportJobRow.component";
import type { TrackedExportJob } from "@/shared/stores/exports/exportJobs.store";

interface ExportJobsListProps {
  jobs: TrackedExportJob[];
  onDismiss: (jobId: string) => void;
  onDownload: (jobId: string) => void;
  onCancel: (jobId: string) => void;
}

export function ExportJobsList({
  jobs,
  onDismiss,
  onDownload,
  onCancel,
}: ExportJobsListProps) {
  return (
    <>
      {jobs.map((job) => (
        <ExportJobRow
          key={job.jobId}
          job={job}
          onDismiss={onDismiss}
          onDownload={onDownload}
          onCancel={onCancel}
        />
      ))}
    </>
  );
}

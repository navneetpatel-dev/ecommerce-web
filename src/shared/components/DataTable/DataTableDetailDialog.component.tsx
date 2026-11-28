"use client";

import { RecordDetailDialog } from "@/shared/components/dialogs/RecordDetailDialog.component";
import type { DataTableProps } from "../../types/data-table/types";
import type { useRowDetailFetcher } from "./hooks/useRowDetailFetcher.hook";

interface DataTableDetailDialogProps<T> {
  enabled: boolean;
  detail: ReturnType<typeof useRowDetailFetcher<T>>;
  fieldLinks?: DataTableProps<T>["detailFieldLinks"];
}

/** The record opened from a row. */
export function DataTableDetailDialog<T>({
  enabled,
  detail,
  fieldLinks,
}: DataTableDetailDialogProps<T>) {
  if (!enabled) return null;
  return (
    <RecordDetailDialog
      open={detail.detailRow != null}
      onOpenChange={(open) => !open && detail.close()}
      record={detail.detailRecord}
      loading={detail.isLoading}
      error={detail.error}
      fieldLinks={fieldLinks}
    />
  );
}

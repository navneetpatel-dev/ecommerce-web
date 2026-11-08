"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CouponBatch } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { adminApi } from "../../api/analytics/admin.api";
import { adminKeys } from "../../api/analytics/admin.queries";
import { downloadCouponCodesCsv } from "../../utils/coupons/couponSummary";

type BatchStatus = "ACTIVE" | "PAUSED";

/** What a pause or resume did, in words: how many codes moved, or why none did. */
function batchStatusMessage(status: BatchStatus, updated: number): string {
  if (updated === 0) {
    return status === "PAUSED"
      ? LABELS.batchNothingToPause
      : LABELS.batchNothingToResume;
  }
  return formatLabel(
    status === "PAUSED" ? LABELS.batchPausedCount : LABELS.batchResumedCount,
    { count: String(updated) },
  );
}

/** Export, pause and resume for one batch of bulk codes, with the outcome shown. */
export function useCouponBatchActions(batch: CouponBatch | null) {
  const queryClient = useQueryClient();
  const statusMutation = useMutation({
    mutationFn: async (status: BatchStatus) => ({
      batchId: batch!.id,
      status,
      result: await adminApi.updateBatchStatus(batch!.id, status),
    }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.coupons.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.couponBatches });
    },
  });
  // Only the open batch's outcome: another batch's dialog starts clean.
  const done =
    statusMutation.data && statusMutation.data.batchId === batch?.id
      ? statusMutation.data
      : null;
  return {
    isPending: statusMutation.isPending,
    statusMessage: done
      ? batchStatusMessage(done.status, Number(done.result?.updated ?? 0))
      : null,
    statusError: statusMutation.isError
      ? getApiErrorMessage(statusMutation.error, LABELS.batchStatusFailed)
      : null,
    pause: () => statusMutation.mutate("PAUSED"),
    resume: () => statusMutation.mutate("ACTIVE"),
    exportCodes: () => {
      if (batch) downloadCouponCodesCsv(batch.name, batch.codes ?? []);
    },
  };
}

"use client";

import { RotateCcw } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Timeline } from "@/shared/components/Timeline";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate, formatInr } from "@/shared/utils/orderFormat";
import {
  buildLogisticsTimeline,
  buildRefundTimeline,
} from "../utils/returnTimeline";
import { useMyReturns } from "../api/returns.queries";

const STATUS_LABEL: Record<string, string> = {
  [RETURN_STATUS.REQUESTED]: LABELS.returnLogisticsRequested,
  [RETURN_STATUS.APPROVED]: LABELS.returnLogisticsApproved,
  [RETURN_STATUS.REJECTED]: LABELS.returnLogisticsRejected,
  [RETURN_STATUS.PICKUP_SCHEDULED]: LABELS.returnLogisticsPickupScheduled,
  [RETURN_STATUS.RECEIVED]: LABELS.returnLogisticsReceived,
  [RETURN_STATUS.REFUNDED]: LABELS.returnRefundStatusCompleted,
  [RETURN_STATUS.CLOSED]: LABELS.returnLogisticsClosed,
};

export function MyReturnsPage() {
  const { data, isLoading, isError, error } = useMyReturns();
  const returns = data ?? [];

  return (
    <div className="storefront-container py-8 md:py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-[1.75rem] text-ink md:text-[2rem]">
          {LABELS.returnsPageTitle}
        </h1>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">
          {LABELS.returnsPageDescription}
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
          {(error as Error)?.message || LABELS.couldNotLoadReturns}
        </p>
      ) : returns.length === 0 ? (
        <div className="border border-dashed border-line bg-paper/50">
          <EmptyState
            icon={RotateCcw}
            heading={LABELS.noReturnsYet}
            message={LABELS.noReturnsYetMessage}
            actionLabel={LABELS.viewOrders}
            actionTo={PATHS.orders}
            className="py-14"
          />
        </div>
      ) : (
        <ul className="space-y-4">
          {returns.map((row) => (
            <li
              key={row.id}
              className="border border-line bg-surface-raised px-5 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">
                    {row.productName || LABELS.orderItemFallback}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-ink-muted">
                    {row.reasonCode.replaceAll("_", " ")} ·{" "}
                    {formatOrderDate(row.createdAt)}
                  </p>
                  <p className="mt-1 text-[0.875rem] text-ink-muted">
                    {row.reason}
                  </p>
                  {row.refundAmount != null ? (
                    <p className="mt-1 text-[0.8125rem] tabular-nums text-ink">
                      {LABELS.returnRefundStatusCompleted}{" "}
                      {formatInr(row.refundAmount)}
                    </p>
                  ) : null}
                </div>
                <Badge variant="outline">
                  {STATUS_LABEL[row.status] ?? row.status}
                </Badge>
              </div>

              <div className="mt-5 grid gap-6 border-t border-line pt-5 md:grid-cols-2">
                <div>
                  <TextEyebrow className="mb-3">
                    {LABELS.returnTimelineRefundTrack}
                  </TextEyebrow>
                  <Timeline steps={buildRefundTimeline(row)} />
                </div>
                <div>
                  <TextEyebrow className="mb-3">
                    {LABELS.returnTimelineLogisticsTrack}
                  </TextEyebrow>
                  <Timeline steps={buildLogisticsTimeline(row)} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

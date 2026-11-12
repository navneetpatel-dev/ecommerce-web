"use client";

import type { RedeliveryChoice } from "@/shared/utils/orders/redeliveryOptions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { RedeliverySlotPicker } from "@/shared/components/orders/RedeliverySlotPicker.component";
import type { TrackingLookupResult } from "../../api/tracking/shipping.api";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { ordersComponentsStyles } from "../../styles/actions/ordersComponents.styles";
import {
  formatDate,
  formatDateTime,
} from "@/shared/utils/formatting/formatDate";
import { useTrackingResult } from "../../hooks/tracking/useTrackingResult.hook";

export function TrackingResult({
  result,
  onReschedule,
  isRescheduling,
}: {
  result: TrackingLookupResult;
  onReschedule: (choice: RedeliveryChoice) => void;
  isRescheduling?: boolean;
}) {
  const { canReschedule, codLabel } = useTrackingResult(result);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{LABELS.trackingResultTitle}</CardTitle>
      </CardHeader>
      <CardContent className={ordersComponentsStyles.resultContent}>
        <div className={ordersComponentsStyles.carrierRow}>
          <StatusBadge status={result.status} />
          {result.carrier ? (
            <span className={ordersComponentsStyles.carrierText}>
              {formatLabel(LABELS.trackingViaCarrier, {
                carrier: result.carrier,
              })}
            </span>
          ) : null}
        </div>
        <p className={ordersComponentsStyles.updateText}>
          {formatLabel(LABELS.trackingLastUpdate, {
            value: formatDateTime(result.lastUpdate),
          })}
        </p>
        {result.estimatedDeliveryDate ? (
          <p className={ordersComponentsStyles.detailText}>
            {formatLabel(LABELS.trackingEstimatedDelivery, {
              value: formatDate(result.estimatedDeliveryDate),
            })}
          </p>
        ) : null}

        {codLabel ? (
          <p className={ordersComponentsStyles.codText}>{codLabel}</p>
        ) : null}

        {result.failureReason ? (
          <p className={ordersComponentsStyles.failureNote}>
            {formatLabel(LABELS.trackingLastAttempt, {
              note: result.failureReason,
            })}
          </p>
        ) : null}

        {canReschedule ? (
          <RedeliverySlotPicker
            currentSlot={result.preferredRedeliverySlot}
            onSubmit={onReschedule}
            isPending={isRescheduling}
            prompt={LABELS.trackingRedeliveryPrompt}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

import { RotateCcw } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

interface PickupOverviewCardProps {
  returnId: string;
  type: "REFUND" | "EXCHANGE";
  status: string;
  orderId?: string | null;
  productName?: string | null;
}

export function PickupOverviewCard({
  returnId,
  type,
  status,
  orderId,
  productName,
}: PickupOverviewCardProps) {
  return (
    <div className="border border-line bg-surface shadow-elevation-1">
      <div className="flex items-center gap-2 border-b border-line bg-paper/55 px-5 py-3.5">
        <RotateCcw className="size-4 text-brand" aria-hidden="true" />
        <TextEyebrow className="!mb-0">Pickup Details</TextEyebrow>
      </div>
      <div className="p-5">
        <dl className="grid gap-3 text-body-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-muted">Return ID</dt>
            <dd className="truncate font-mono font-medium text-ink">
              #{returnId.slice(0, 8)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-muted">Type</dt>
            <dd className="font-medium text-brand">{type}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-muted">Status</dt>
            <dd>
              <StatusBadge status={status} />
            </dd>
          </div>
          {productName ? (
            <div className="border-t border-line/60 pt-3">
              <dt className="text-ink-muted">Item</dt>
              <dd className="mt-0.5 truncate font-medium text-ink">
                {productName}
              </dd>
            </div>
          ) : null}
          {orderId ? (
            <div className="flex items-center justify-between gap-2 border-t border-line/60 pt-3">
              <dt className="text-ink-muted">Order Ref</dt>
              <dd className="font-mono text-[0.8125rem] text-ink">
                #{orderId.slice(0, 8)}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}

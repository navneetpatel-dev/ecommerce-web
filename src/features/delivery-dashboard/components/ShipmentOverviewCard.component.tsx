import { Package } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

interface ShipmentOverviewCardProps {
  trackingNumber: string;
  status: string;
  orderId?: string | null;
  assignedAt?: string | null;
}

export function ShipmentOverviewCard({
  trackingNumber,
  status,
  orderId,
  assignedAt,
}: ShipmentOverviewCardProps) {
  return (
    <div className="border border-line bg-surface shadow-elevation-1">
      <div className="flex items-center gap-2 border-b border-line bg-paper/55 px-5 py-3.5">
        <Package className="size-4 text-brand" aria-hidden="true" />
        <TextEyebrow className="!mb-0">Shipment Details</TextEyebrow>
      </div>
      <div className="p-5">
        <dl className="grid gap-3 text-body-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-muted">Tracking #</dt>
            <dd className="truncate font-mono font-medium text-ink">
              {trackingNumber}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-muted">Status</dt>
            <dd>
              <StatusBadge status={status} />
            </dd>
          </div>
          {orderId ? (
            <div className="flex items-center justify-between gap-2 border-t border-line/60 pt-3">
              <dt className="text-ink-muted">Order Ref</dt>
              <dd className="font-mono text-[0.8125rem] text-ink">
                #{orderId.slice(0, 8)}
              </dd>
            </div>
          ) : null}
          {assignedAt ? (
            <div className="flex items-center justify-between gap-2 border-t border-line/60 pt-3">
              <dt className="text-ink-muted">Assigned</dt>
              <dd className="text-caption text-ink-muted">
                {new Date(assignedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}

import { ImageIcon, Package } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

interface ShipmentOverviewCardProps {
  trackingNumber: string;
  status: string;
  orderId?: string | null;
  assignedAt?: string | null;
  items?: Array<{ id: string; productName: string; quantity: number }>;
  codAmount?: number | null;
  codCollected?: boolean;
  proofOfDeliveryUrl?: string | null;
  failureReason?: string | null;
  preferredRedeliverySlot?: string | null;
}

export function ShipmentOverviewCard({
  trackingNumber,
  status,
  orderId,
  assignedAt,
  items,
  codAmount,
  codCollected,
  proofOfDeliveryUrl,
  failureReason,
  preferredRedeliverySlot,
}: ShipmentOverviewCardProps) {
  const orderRefSection = orderId ? (
    <div className="flex items-center justify-between gap-2 border-t border-line/60 pt-3">
      <dt className="text-ink-muted">Order Ref</dt>
      <dd className="font-mono text-[0.8125rem] text-ink">
        #{orderId.slice(0, 8)}
      </dd>
    </div>
  ) : null;

  const assignedAtTime = assignedAt
    ? new Date(assignedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const assignedAtSection = assignedAt ? (
    <div className="flex items-center justify-between gap-2 border-t border-line/60 pt-3">
      <dt className="text-ink-muted">Assigned</dt>
      <dd className="text-caption text-ink-muted">{assignedAtTime}</dd>
    </div>
  ) : null;

  const codStatusLabel = codCollected ? "collected" : "due";
  const codSection =
    codAmount != null ? (
      <div className="flex items-center justify-between gap-2 border-t border-line/60 pt-3">
        <dt className="text-ink-muted">Cash on delivery</dt>
        <dd className="font-medium text-ink">
          ₹{codAmount.toFixed(2)}{" "}
          <span className="text-caption text-ink-muted">
            ({codStatusLabel})
          </span>
        </dd>
      </div>
    ) : null;

  const failureNotice = failureReason ? (
    <p className="text-body-sm text-ink">
      <span className="text-ink-muted">Last attempt failed: </span>
      {failureReason}
    </p>
  ) : null;
  const redeliveryNotice = preferredRedeliverySlot ? (
    <p className="mt-1 text-body-sm font-medium text-brand">
      Customer requested redelivery: {preferredRedeliverySlot}
    </p>
  ) : null;
  const hasFailureOrRedeliveryNotice = Boolean(
    failureReason || preferredRedeliverySlot,
  );
  const failureOrRedeliverySection = hasFailureOrRedeliveryNotice ? (
    <div className="mt-4 border-t border-line/60 pt-3">
      {failureNotice}
      {redeliveryNotice}
    </div>
  ) : null;

  const itemRows = (items ?? []).map((item) => (
    <li key={item.id} className="text-body-sm text-ink">
      {item.productName}{" "}
      <span className="text-ink-muted">× {item.quantity}</span>
    </li>
  ));
  const itemsSection = items?.length ? (
    <div className="mt-4 border-t border-line/60 pt-3">
      <p className="text-caption font-semibold uppercase tracking-wider text-ink-muted">
        Package contents
      </p>
      <ul className="mt-2 space-y-1">{itemRows}</ul>
    </div>
  ) : null;

  const proofLink = proofOfDeliveryUrl ? (
    <a
      href={proofOfDeliveryUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-4 flex items-center gap-2 border-t border-line/60 pt-3 text-body-sm font-medium text-brand hover:underline"
    >
      <ImageIcon className="size-4" aria-hidden="true" />
      View proof of delivery photo
    </a>
  ) : null;

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
          {orderRefSection}
          {assignedAtSection}
          {codSection}
        </dl>

        {failureOrRedeliverySection}

        {itemsSection}

        {proofLink}
      </div>
    </div>
  );
}

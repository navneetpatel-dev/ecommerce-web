import { Phone } from "lucide-react";
import type { OrderItem, SubOrder } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { Timeline } from "@/shared/components/Timeline.component";
import { buildSubOrderTimeline } from "../../utils/timeline";
import { ORDER_STATUS, SHIPMENT_STATUS } from "@/shared/constants/statuses";
import type { ReturnReasonCode } from "../../hooks/useSubOrderReturn.hook";
import { VENDOR_GROUP_CARD } from "@/shared/components/vendorGroupStyles";
import { SubOrderCardHeader } from "./SubOrderCardHeader.component";
import { SubOrderCardItems } from "./SubOrderCardItems.component";
import { SubOrderCardTotals } from "./SubOrderCardTotals.component";
import { SubOrderReturnDialog } from "./SubOrderReturnDialog.component";
import { DeliveryRatingPrompt } from "../DeliveryRatingPrompt.component";

interface SubOrderCardProps {
  subOrder: SubOrder;
  returnTarget: OrderItem | null;
  reasonCode: ReturnReasonCode;
  reason: string;
  returnType: "REFUND" | "EXCHANGE";
  photoUrls: string[];
  draftUploadId: string;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  onOpenReturn: (item: OrderItem) => void;
  onCloseReturn: () => void;
  onReasonCodeChange: (code: ReturnReasonCode) => void;
  onReasonChange: (value: string) => void;
  onReturnTypeChange: (value: "REFUND" | "EXCHANGE") => void;
  onPhotoUrlsChange: (urls: string[]) => void;
  onSubmitReturn: () => void;
}

export function SubOrderCard({
  subOrder,
  returnTarget,
  reasonCode,
  reason,
  returnType,
  photoUrls,
  draftUploadId,
  isPending,
  isSuccess,
  error,
  onOpenReturn,
  onCloseReturn,
  onReasonCodeChange,
  onReasonChange,
  onReturnTypeChange,
  onPhotoUrlsChange,
  onSubmitReturn,
}: SubOrderCardProps) {
  const timeline = buildSubOrderTimeline(subOrder);
  const showTimeline = subOrder.status !== ORDER_STATUS.PENDING;
  const vendorName = subOrder.vendor?.businessName || "Seller";
  const itemCount = subOrder.items?.length ?? 0;
  const canReturn = subOrder.status === ORDER_STATUS.DELIVERED;

  return (
    <section className={VENDOR_GROUP_CARD}>
      <SubOrderCardHeader
        vendorName={vendorName}
        vendorId={subOrder.vendor?.id}
        itemCount={itemCount}
        status={subOrder.status}
        className="mb-1"
      />

      <SubOrderCardItems
        items={subOrder.items}
        canReturn={canReturn}
        onOpenReturn={onOpenReturn}
      />

      <SubOrderCardTotals subOrder={subOrder} />

      {showTimeline && (
        <div className="mt-5 border-t border-line pt-5">
          <TextEyebrow className="mb-3">Progress</TextEyebrow>
          <Timeline steps={timeline} />
        </div>
      )}

      {subOrder.shipment && (
        <div className="mt-4 border-t border-dashed border-line pt-4">
          <TextEyebrow className="mb-2">Tracking</TextEyebrow>
          <p className="text-body text-ink">{subOrder.shipment.carrier}</p>
          <p className="mt-0.5 font-mono text-body-sm text-ink-muted">
            {subOrder.shipment.trackingNumber}
          </p>
          <div className="mt-2">
            <StatusBadge status={subOrder.shipment.status} />
          </div>
          {subOrder.shipment.deliveryAgent && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-body-sm text-ink-muted">
                Delivery agent: {subOrder.shipment.deliveryAgent.fullName}
              </p>
              {subOrder.shipment.deliveryAgent.phone &&
              (
                [
                  SHIPMENT_STATUS.PICKED_UP,
                  SHIPMENT_STATUS.IN_TRANSIT,
                  SHIPMENT_STATUS.OUT_FOR_DELIVERY,
                ] as string[]
              ).includes(subOrder.shipment.status) ? (
                <a
                  href={`tel:${subOrder.shipment.deliveryAgent.phone}`}
                  className="inline-flex items-center gap-1 text-body-sm font-medium text-brand hover:underline"
                >
                  <Phone className="size-3.5" aria-hidden="true" />
                  Call agent
                </a>
              ) : null}
            </div>
          )}
          {subOrder.shipment.status === SHIPMENT_STATUS.OUT_FOR_DELIVERY && (
            <p className="mt-2 rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-ink">
              Your order is out for delivery. Share the code from your email
              with the delivery agent to receive it.
            </p>
          )}
          {subOrder.shipment.codAmount != null && (
            <p className="mt-2 text-body-sm text-ink-muted">
              Cash on delivery: ₹{subOrder.shipment.codAmount.toFixed(2)}{" "}
              {subOrder.shipment.codCollected
                ? "(collected)"
                : "(due at doorstep)"}
            </p>
          )}
          {subOrder.shipment.attempts?.length ? (
            <div className="mt-2 space-y-1.5">
              {subOrder.shipment.attempts.map((attempt) => (
                <p
                  key={attempt.id}
                  className="rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning"
                >
                  Attempt {attempt.attemptNumber} note: {attempt.note}
                  {attempt.photoUrl ? (
                    <a
                      href={attempt.photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 font-medium text-brand hover:underline"
                    >
                      View photo
                    </a>
                  ) : null}
                </p>
              ))}
            </div>
          ) : null}
          {subOrder.shipment.status === SHIPMENT_STATUS.RTO_INITIATED && (
            <p className="mt-2 rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning">
              We couldn&apos;t deliver this after multiple attempts — it&apos;s
              being routed back to the seller.
            </p>
          )}
          {subOrder.shipment.proofOfDeliveryUrl && (
            <a
              href={subOrder.shipment.proofOfDeliveryUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-body-sm font-medium text-brand hover:underline"
            >
              View proof of delivery photo
            </a>
          )}
          {subOrder.shipment.status === SHIPMENT_STATUS.DELIVERED && (
            <DeliveryRatingPrompt shipmentId={subOrder.shipment.id} />
          )}
        </div>
      )}

      <SubOrderReturnDialog
        returnTarget={returnTarget}
        reasonCode={reasonCode}
        reason={reason}
        returnType={returnType}
        photoUrls={photoUrls}
        draftUploadId={draftUploadId}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
        onCloseReturn={onCloseReturn}
        onReasonCodeChange={onReasonCodeChange}
        onReasonChange={onReasonChange}
        onReturnTypeChange={onReturnTypeChange}
        onPhotoUrlsChange={onPhotoUrlsChange}
        onSubmitReturn={onSubmitReturn}
      />
    </section>
  );
}

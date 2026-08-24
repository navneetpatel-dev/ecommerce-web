import type { OrderItem, SubOrder } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { Timeline } from "@/shared/components/Timeline.component";
import { buildSubOrderTimeline } from "../../utils/timeline";
import { ORDER_STATUS } from "@/shared/constants/statuses";
import type { ReturnReasonCode } from "../../hooks/useSubOrderReturn.hook";
import { SubOrderCardHeader } from "./SubOrderCardHeader.component";
import { SubOrderCardItems } from "./SubOrderCardItems.component";
import { SubOrderCardTotals } from "./SubOrderCardTotals.component";
import { SubOrderReturnDialog } from "./SubOrderReturnDialog.component";

interface SubOrderCardProps {
  subOrder: SubOrder;
  returnTarget: OrderItem | null;
  reasonCode: ReturnReasonCode;
  reason: string;
  photoUrls: string[];
  draftUploadId: string;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  onOpenReturn: (item: OrderItem) => void;
  onCloseReturn: () => void;
  onReasonCodeChange: (code: ReturnReasonCode) => void;
  onReasonChange: (value: string) => void;
  onPhotoUrlsChange: (urls: string[]) => void;
  onSubmitReturn: () => void;
}

export function SubOrderCard({
  subOrder,
  returnTarget,
  reasonCode,
  reason,
  photoUrls,
  draftUploadId,
  isPending,
  isSuccess,
  error,
  onOpenReturn,
  onCloseReturn,
  onReasonCodeChange,
  onReasonChange,
  onPhotoUrlsChange,
  onSubmitReturn,
}: SubOrderCardProps) {
  const timeline = buildSubOrderTimeline(subOrder);
  const showTimeline = subOrder.status !== ORDER_STATUS.PENDING;
  const vendorName = subOrder.vendor?.businessName || "Seller";
  const itemCount = subOrder.items?.length ?? 0;
  const canReturn = subOrder.status === ORDER_STATUS.DELIVERED;

  return (
    <section>
      <SubOrderCardHeader
        vendorName={vendorName}
        itemCount={itemCount}
        status={subOrder.status}
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
        </div>
      )}

      <SubOrderReturnDialog
        returnTarget={returnTarget}
        reasonCode={reasonCode}
        reason={reason}
        photoUrls={photoUrls}
        draftUploadId={draftUploadId}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
        onCloseReturn={onCloseReturn}
        onReasonCodeChange={onReasonCodeChange}
        onReasonChange={onReasonChange}
        onPhotoUrlsChange={onPhotoUrlsChange}
        onSubmitReturn={onSubmitReturn}
      />
    </section>
  );
}

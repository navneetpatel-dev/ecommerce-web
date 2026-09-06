import type { OrderItem, SubOrder } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Timeline } from "@/shared/components/Timeline.component";
import { buildSubOrderTimeline } from "../../utils/timeline";
import { ORDER_STATUS } from "@/shared/constants/statuses";
import type { ReturnReasonCode } from "../../hooks/useSubOrderReturn.hook";
import { VENDOR_GROUP_CARD } from "@/shared/components/vendorGroupStyles";
import { SubOrderCardHeader } from "./SubOrderCardHeader.component";
import { SubOrderCardItems } from "./SubOrderCardItems.component";
import { SubOrderCardTotals } from "./SubOrderCardTotals.component";
import { SubOrderReturnDialog } from "./SubOrderReturnDialog.component";
import { SubOrderShipmentTracking } from "./SubOrderShipmentTracking.component";
import { BuyAgainButton } from "../BuyAgainButton.component";

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

      <div className="mt-4">
        <BuyAgainButton items={subOrder.items ?? []} />
      </div>

      {showTimeline && (
        <div className="mt-5 border-t border-line pt-5">
          <TextEyebrow className="mb-3">Progress</TextEyebrow>
          <Timeline steps={timeline} />
        </div>
      )}

      {subOrder.shipment && (
        <SubOrderShipmentTracking shipment={subOrder.shipment} />
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

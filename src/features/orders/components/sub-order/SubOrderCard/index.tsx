import type { OrderItem, SubOrder } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { Timeline } from "@/shared/components/display/Timeline.component";
import { LABELS } from "@/shared/constants/labels";
import type { ReturnReasonCode } from "../../../hooks/sub-order/useSubOrderReturn.hook";
import { VENDOR_GROUP_CARD } from "@/shared/styles/orders/vendorGroupStyles";
import { SubOrderCardHeader } from "./SubOrderCardHeader.component";
import { SubOrderCardItems } from "./SubOrderCardItems.component";
import { SubOrderCardTotals } from "./SubOrderCardTotals.component";
import { SubOrderReturnDialog } from "./SubOrderReturnDialog.component";
import { SubOrderRefundNote } from "./SubOrderRefundNote.component";
import { SubOrderShipmentTracking } from "./SubOrderShipmentTracking.component";
import { BuyAgainButton } from "../../actions/BuyAgainButton.component";
import { useSubOrderCard } from "../../../hooks/sub-order/useSubOrderCard.hook";
import { SUB_ORDER_CARD_STYLES } from "../../../styles/sub-order/subOrderCard.styles";

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
  /** Dialog dismissal (Escape/backdrop) — guard-aware. */
  onDialogOpenChange: (open: boolean) => void;
  /** Cancel button — guard-aware. */
  onRequestClose: () => void;
  onReasonCodeSelect: (value: string) => void;
  onReasonInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReturnTypeSelect: (value: string) => void;
  onPhotoUrlsChange: (urls: string[]) => void;
  onSubmitReturn: () => void;
  discardOpen: boolean;
  onDiscardOpenChange: (open: boolean) => void;
  onConfirmDiscard: () => void;
  onKeepEditing: () => void;
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
  onDialogOpenChange,
  onRequestClose,
  onReasonCodeSelect,
  onReasonInput,
  onReturnTypeSelect,
  onPhotoUrlsChange,
  onSubmitReturn,
  discardOpen,
  onDiscardOpenChange,
  onConfirmDiscard,
  onKeepEditing,
}: SubOrderCardProps) {
  const {
    timeline,
    showTimeline,
    vendorName,
    itemCount,
    canReturn,
    items,
    refundNote,
  } = useSubOrderCard({ subOrder });

  return (
    <section className={VENDOR_GROUP_CARD}>
      <SubOrderCardHeader
        vendorName={vendorName}
        vendorId={subOrder.vendor?.id}
        itemCount={itemCount}
        status={subOrder.status}
        className={SUB_ORDER_CARD_STYLES.headerMargin}
      />

      <SubOrderCardItems
        items={subOrder.items}
        canReturn={canReturn}
        onOpenReturn={onOpenReturn}
      />

      <SubOrderCardTotals subOrder={subOrder} />
      <SubOrderRefundNote note={refundNote} />

      <div className={SUB_ORDER_CARD_STYLES.buyAgainWrapper}>
        <BuyAgainButton items={items} />
      </div>

      {showTimeline && (
        <div className={SUB_ORDER_CARD_STYLES.timelineContainer}>
          <TextEyebrow className={SUB_ORDER_CARD_STYLES.timelineEyebrow}>
            {LABELS.subOrderProgress}
          </TextEyebrow>
          <Timeline steps={timeline} />
        </div>
      )}

      {subOrder.shipment && (
        <SubOrderShipmentTracking
          shipment={subOrder.shipment}
          orderId={subOrder.orderId}
        />
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
        onDialogOpenChange={onDialogOpenChange}
        onRequestClose={onRequestClose}
        onReasonCodeSelect={onReasonCodeSelect}
        onReasonInput={onReasonInput}
        onReturnTypeSelect={onReturnTypeSelect}
        onPhotoUrlsChange={onPhotoUrlsChange}
        onSubmitReturn={onSubmitReturn}
        discardOpen={discardOpen}
        onDiscardOpenChange={onDiscardOpenChange}
        onConfirmDiscard={onConfirmDiscard}
        onKeepEditing={onKeepEditing}
      />
    </section>
  );
}

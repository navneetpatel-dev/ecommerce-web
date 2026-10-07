"use client";

import type { SubOrder } from "@/shared/api/types";
import { SubOrderCard } from "../../components/sub-order/SubOrderCard/index";
import { useSubOrderReturn } from "../../hooks/sub-order/useSubOrderReturn.hook";

interface SubOrderCardContainerProps {
  subOrder: SubOrder;
}

export function SubOrderCardContainer({
  subOrder,
}: SubOrderCardContainerProps) {
  const returnDialog = useSubOrderReturn();

  return (
    <SubOrderCard
      subOrder={subOrder}
      returnTarget={returnDialog.target}
      reasonCode={returnDialog.reasonCode}
      reason={returnDialog.reason}
      returnType={returnDialog.type}
      photoUrls={returnDialog.photoUrls}
      draftUploadId={returnDialog.draftUploadId}
      isPending={returnDialog.isPending}
      isSuccess={returnDialog.isSuccess}
      error={returnDialog.error}
      onOpenReturn={returnDialog.openDialog}
      onDialogOpenChange={returnDialog.handleDialogOpenChange}
      onRequestClose={returnDialog.handleCancelReturn}
      onReasonCodeSelect={returnDialog.handleReasonCodeSelect}
      onReasonInput={returnDialog.handleReasonInput}
      onReturnTypeSelect={returnDialog.handleReturnTypeSelect}
      onPhotoUrlsChange={returnDialog.setPhotoUrls}
      onSubmitReturn={returnDialog.submitReturn}
      discardOpen={returnDialog.discardOpen}
      onDiscardOpenChange={returnDialog.handleDiscardOpenChange}
      onConfirmDiscard={returnDialog.confirmDiscard}
      onKeepEditing={returnDialog.cancelDiscard}
    />
  );
}

"use client";

import type { SubOrder } from "@/shared/api/types";
import { SubOrderCard } from "../components/SubOrderCard";
import { useSubOrderReturn } from "../hooks/useSubOrderReturn.hook";

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
      photoUrls={returnDialog.photoUrls}
      draftUploadId={returnDialog.draftUploadId}
      isPending={returnDialog.isPending}
      isSuccess={returnDialog.isSuccess}
      error={returnDialog.error}
      onOpenReturn={returnDialog.openDialog}
      onCloseReturn={returnDialog.closeDialog}
      onReasonCodeChange={returnDialog.setReasonCode}
      onReasonChange={returnDialog.setReason}
      onPhotoUrlsChange={returnDialog.setPhotoUrls}
      onSubmitReturn={returnDialog.submitReturn}
    />
  );
}

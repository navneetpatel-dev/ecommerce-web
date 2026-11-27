"use client";

import { Truck } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import type { AdminDataRow } from "../../../hooks/shared/useAdminDataList.hook";
import { useAdminOrderShipmentAction } from "../../../hooks/orders/useAdminOrderShipmentAction.hook";
import { adminOrderShipmentActionStyles as styles } from "../../../styles/orders/adminOrderShipmentAction.styles";
import { AdminOrderShipmentList } from "./AdminOrderShipmentList.component";

interface AdminOrderShipmentActionProps {
  row: AdminDataRow;
}

export function AdminOrderShipmentAction({
  row,
}: AdminOrderShipmentActionProps) {
  const shipment = useAdminOrderShipmentAction(row);

  return (
    <Dialog open={shipment.open} onOpenChange={shipment.handleOpenChange}>
      <DialogTrigger asChild>
        <RowActionButton
          icon={Truck}
          label={LABELS.viewShipment}
          onClick={shipment.handleOpen}
        />
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>{LABELS.shipmentDetails}</DialogTitle>
          <DialogDescription>{LABELS.shipmentDetailsHint}</DialogDescription>
        </DialogHeader>
        <AdminOrderShipmentList
          orderId={shipment.orderId}
          shipments={shipment.shipments}
          isLoading={shipment.isLoading}
          isEmpty={shipment.isEmpty}
          retryingSubOrderId={shipment.retryingSubOrderId}
          onRetryRefund={shipment.handleRetryRefund}
        />
        {shipment.retryError ? (
          <p className={styles.refundFailedText}>{shipment.retryError}</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

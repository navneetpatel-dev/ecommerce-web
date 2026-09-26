"use client";

import { Truck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
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
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("neutral")}
        onClick={shipment.handleOpen}
      >
        <Truck strokeWidth={2.25} aria-hidden />
        <span>{LABELS.viewShipment}</span>
      </Button>
      <Dialog open={shipment.open} onOpenChange={shipment.handleOpenChange}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>{LABELS.shipmentDetails}</DialogTitle>
            <DialogDescription>{LABELS.shipmentDetailsHint}</DialogDescription>
          </DialogHeader>
          <AdminOrderShipmentList
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
    </>
  );
}

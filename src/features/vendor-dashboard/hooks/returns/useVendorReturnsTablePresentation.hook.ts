import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { RETURN_STATUS_LABEL } from "@/features/returns";
import type { ProductImage, ReturnRequest } from "@/shared/api/types";

export interface VendorReturnRowViewModel {
  id: string;
  productLabel: string;
  customerLabel: string;
  reasonLabel: string;
  pickupLabel: string;
  status: string;
  statusLabel: string;
  images: ProductImage[];
}

function pickupLabelFor(row: ReturnRequest): string {
  if (row.pickupFailureReason) return row.pickupFailureReason;
  if (row.pickupOtpVerifiedAt) return LABELS.returnLogisticsReceived;
  if (row.status === RETURN_STATUS.PICKUP_SCHEDULED) {
    return LABELS.returnLogisticsPickupScheduled;
  }
  if (row.status === RETURN_STATUS.RECEIVED) {
    return LABELS.returnLogisticsReceived;
  }
  return LABELS.emptyCell;
}

function imagesFor(row: ReturnRequest): ProductImage[] {
  return (row.photoUrls ?? []).map((url, index) => ({
    id: `${row.id}-photo-${index}`,
    url,
    isPrimary: index === 0,
  }));
}

export function useVendorReturnsTablePresentation(returns: ReturnRequest[]) {
  const rows: VendorReturnRowViewModel[] = useMemo(
    () =>
      returns.map((row) => ({
        id: row.id,
        productLabel: row.productName ?? LABELS.orderItemFallback,
        customerLabel: row.customerName ?? LABELS.emptyCell,
        reasonLabel: `${row.reasonCode.replaceAll("_", " ")} · ${row.reason}`,
        pickupLabel: pickupLabelFor(row),
        status: row.status,
        statusLabel: RETURN_STATUS_LABEL[row.status] ?? row.status,
        images: imagesFor(row),
      })),
    [returns],
  );

  return {
    rows,
    isEmpty: rows.length === 0,
  };
}

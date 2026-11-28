import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { RETURN_STATUS_LABEL, formatReturnReason } from "@/features/returns";
import type { ProductImage, ReturnRequest } from "@/shared/api/types";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";

export interface VendorReturnRowViewModel {
  id: string;
  returnReference: string;
  orderReference: string | null;
  productLabel: string;
  customerLabel: string;
  reasonLabel: string;
  pickupLabel: string;
  status: string;
  statusLabel: string;
  images: ProductImage[];
  photoCount: number;
  /** Picked up and not yet put back in stock: the vendor may restock it. */
  canRestock: boolean;
  restocked: boolean;
  canDispute: boolean;
  isDisputed: boolean;
  disputeStatus: string | null;
}

function pickupLabelFor(row: ReturnRequest): string {
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
  // Disputing a return puts the customer's refund in question, so it needs payout access.
  const { hasPermission } = usePermissions();
  const mayDispute = hasPermission(PERMISSIONS.PAYOUT_VIEW);
  const rows: VendorReturnRowViewModel[] = useMemo(
    () =>
      returns.map((row) => {
        const reasonTitle = formatReturnReason(row.reasonCode);
        const reasonDetail = row.reason?.trim();
        return {
          id: row.id,
          returnReference:
            row.returnReference ?? `#RET-${row.id.slice(0, 8).toUpperCase()}`,
          orderReference: row.orderReference ?? null,
          productLabel: row.productName ?? LABELS.orderItemFallback,
          customerLabel: row.customerName ?? LABELS.emptyCell,
          reasonLabel: reasonDetail
            ? `${reasonTitle} · ${reasonDetail}`
            : reasonTitle,
          pickupLabel: pickupLabelFor(row),
          status: row.status,
          statusLabel: RETURN_STATUS_LABEL[row.status] ?? row.status,
          images: imagesFor(row),
          photoCount: row.photoCount ?? row.photoUrls?.length ?? 0,
          canRestock:
            Boolean(row.receivedAt) && !row.restockedAt && !row.disputedAt,
          restocked: Boolean(row.restockedAt),
          canDispute:
            mayDispute &&
            (Boolean(row.receivedAt) ||
              row.status === RETURN_STATUS.PICKUP_SCHEDULED) &&
            !row.disputedAt &&
            !row.restockedAt,
          isDisputed: Boolean(row.disputedAt) || Boolean(row.disputeStatus),
          disputeStatus: row.disputeStatus ?? null,
        };
      }),
    [returns, mayDispute],
  );

  return {
    rows,
    isEmpty: rows.length === 0,
  };
}

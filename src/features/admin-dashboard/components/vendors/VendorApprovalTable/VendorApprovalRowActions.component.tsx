import { useCallback } from "react";
import { CircleX } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";
import { AdminApproveVendorAction } from "../AdminApproveVendorAction.component";
import { VendorKycDocumentsMenuAction } from "../VendorKycDocumentsMenuAction.component";

interface Vendor {
  id: string;
  businessName: string;
  slug: string;
  kycComplete?: boolean;
}

interface VendorApprovalRowActionsProps {
  vendor: Vendor;
  rowBusy: boolean;
  onApprove: (id: string, commissionRate?: number) => void | Promise<unknown>;
  onReject: (id: string, reason: string) => void | Promise<unknown>;
  onRefresh?: () => void;
}

export function VendorApprovalRowActions({
  vendor,
  rowBusy,
  onApprove,
  onReject,
  onRefresh,
}: VendorApprovalRowActionsProps) {
  const handleApprove = useCallback(
    (commissionRate?: number) => {
      void onApprove(vendor.id, commissionRate);
    },
    [onApprove, vendor.id],
  );

  const handleReject = useCallback(
    (reason?: string) => {
      void onReject(vendor.id, reason ?? "");
    },
    [onReject, vendor.id],
  );

  const vendorDisplayName = formatLabel(LABELS.confirmApproveVendorBody, {
    name: vendor.businessName,
  });

  const rejectDescription = formatLabel(LABELS.confirmRejectVendorBody, {
    name: vendor.businessName,
  });

  return (
    <>
      <VendorKycDocumentsMenuAction
        vendorId={vendor.id}
        vendorName={vendor.businessName}
        onClose={onRefresh}
      />
      <AdminApproveVendorAction
        vendorName={vendorDisplayName}
        onApprove={handleApprove}
        disabled={!vendor.kycComplete || rowBusy}
        disabledHint={
          !vendor.kycComplete ? LABELS.kycApproveBlocked : undefined
        }
      />
      <AdminConfirmAction
        label={LABELS.reject}
        icon={CircleX}
        tone="danger"
        dialogVariant="danger"
        title={LABELS.confirmRejectVendorTitle}
        description={rejectDescription}
        confirmLabel={LABELS.reject}
        requireReason
        reasonHint={LABELS.enterRejectionReason}
        onConfirm={handleReject}
        disabled={rowBusy}
      />
    </>
  );
}

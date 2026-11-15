"use client";

import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { adminApi } from "../../api/analytics/admin.api";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
import { VendorKycDocumentsMenuAction } from "./VendorKycDocumentsMenuAction.component";

interface AdminVendorDetailActionsProps {
  vendorId: string;
  vendorName: string;
  status: string;
  onRefresh: () => void;
}

export function AdminVendorDetailActions({
  vendorId,
  vendorName,
  status,
  onRefresh,
}: AdminVendorDetailActionsProps) {
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(PERMISSIONS.VENDOR_MANAGE);
  const canApprove = hasPermission(PERMISSIONS.VENDOR_APPROVE);

  const handleApprove = async () => {
    await adminApi.approveVendor(vendorId);
    onRefresh();
  };

  const handleReject = async (reason?: string) => {
    await adminApi.rejectVendor(vendorId, reason ?? "");
    onRefresh();
  };

  const handleSuspend = async (reason?: string) => {
    await adminApi.suspendVendor(vendorId, reason ?? "");
    onRefresh();
  };

  const handleUnsuspend = async () => {
    await adminApi.unsuspendVendor(vendorId);
    onRefresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <VendorKycDocumentsMenuAction
        vendorId={vendorId}
        vendorName={vendorName}
      />

      {canApprove && status === "PENDING" && (
        <>
          <AdminConfirmAction
            label={LABELS.approve}
            dialogVariant="success"
            tone="success"
            title={LABELS.confirmApproveVendorTitle}
            description={formatLabel(LABELS.confirmApproveVendorBody, {
              name: vendorName,
            })}
            confirmLabel={LABELS.approve}
            onConfirm={handleApprove}
          />
          <AdminConfirmAction
            label={LABELS.reject}
            dialogVariant="danger"
            tone="danger"
            title={LABELS.confirmRejectVendorTitle}
            description={formatLabel(LABELS.confirmRejectVendorBody, {
              name: vendorName,
            })}
            confirmLabel={LABELS.reject}
            requireReason
            reasonLabel={LABELS.rejectionNote}
            reasonHint={LABELS.enterRejectionNote}
            onConfirm={handleReject}
          />
        </>
      )}

      {canManage && status === "APPROVED" && (
        <AdminConfirmAction
          label={LABELS.suspend}
          dialogVariant="warning"
          tone="neutral"
          title={LABELS.confirmSuspendVendorTitle}
          description={formatLabel(LABELS.confirmSuspendVendorBody, {
            name: vendorName,
          })}
          requireReason
          reasonHint={LABELS.enterSuspendReason}
          onConfirm={handleSuspend}
        />
      )}

      {canManage && status === "SUSPENDED" && (
        <AdminConfirmAction
          label={LABELS.unsuspend}
          dialogVariant="info"
          tone="neutral"
          title={LABELS.confirmUnsuspendVendorTitle}
          description={formatLabel(LABELS.confirmUnsuspendVendorBody, {
            name: vendorName,
          })}
          onConfirm={handleUnsuspend}
        />
      )}
    </div>
  );
}

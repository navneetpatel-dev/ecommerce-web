"use client";

import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";
import { VendorKycDocumentsMenuAction } from "../VendorKycDocumentsMenuAction.component";
import { adminRowLabel } from "../../../utils/shared/adminRowLabel";
import type { AdminDataRow } from "../../../hooks/shared/useAdminDataList.hook";
import { useVendorRowActionsHandlers } from "../../../hooks/vendors/useVendorRowActionsHandlers.hook";

export interface VendorRowActionsProps {
  row: AdminDataRow;
  onReload: () => void;
}

export function VendorRowActions({ row, onReload }: VendorRowActionsProps) {
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(PERMISSIONS.VENDOR_MANAGE);
  const name = adminRowLabel(row);
  const vendorId = String(row.id);

  const { handleUnsuspend, handleSuspend, handleDelete } =
    useVendorRowActionsHandlers(vendorId, onReload);

  return (
    <>
      <VendorKycDocumentsMenuAction vendorId={vendorId} vendorName={name} />
      {canManage && row.status === "SUSPENDED" ? (
        <AdminConfirmAction
          label={LABELS.unsuspend}
          icon={RotateCcw}
          dialogVariant="success"
          tone="neutral"
          title={LABELS.confirmUnsuspendVendorTitle}
          description={formatLabel(LABELS.confirmUnsuspendVendorBody, { name })}
          onConfirm={handleUnsuspend}
        />
      ) : canManage && row.status === "APPROVED" ? (
        <AdminConfirmAction
          label={LABELS.suspend}
          dialogVariant="warning"
          tone="neutral"
          title={LABELS.confirmSuspendVendorTitle}
          description={formatLabel(LABELS.confirmSuspendVendorBody, { name })}
          requireReason
          reasonHint={LABELS.enterSuspendReason}
          onConfirm={handleSuspend}
        />
      ) : null}
      {canManage ? (
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          tone="danger"
          title={LABELS.confirmDeleteVendorTitle}
          description={formatLabel(LABELS.confirmDeleteVendorBody, { name })}
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  );
}

/**
 * Flat action slots for the all-vendors list.
 * Return this Fragment directly from DataTable `actions` — do not wrap in another component.
 */
export function renderVendorRowActions({
  row,
  onReload,
}: VendorRowActionsProps): ReactNode {
  return <VendorRowActions row={row} onReload={onReload} />;
}

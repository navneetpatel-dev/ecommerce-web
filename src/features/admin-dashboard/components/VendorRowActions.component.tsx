"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { Button } from "@/shared/components/ui/button";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { AdminConfirmAction } from "./AdminConfirmAction.component";
import { VendorKycDocumentsMenuAction } from "./VendorKycDocumentsMenuAction.component";
import { adminApi } from "../api/admin.api";
import { adminRowLabel } from "../utils/adminRowLabel";
import type { AdminDataRow } from "../hooks/useAdminDataList.hook";

interface VendorRowActionsProps {
  row: AdminDataRow;
  onReload: () => void;
}

/**
 * Flat action slots for the all-vendors list.
 * Return this Fragment directly from DataTable `actions` — do not wrap in another component.
 */
export function renderVendorRowActions({
  row,
  onReload,
}: VendorRowActionsProps): ReactNode {
  const name = adminRowLabel(row);
  const vendorId = String(row.id);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("neutral")}
        asChild
      >
        <Link href={`/admin/vendors/${vendorId}`}>
          <Eye strokeWidth={2.25} aria-hidden />
          <span>{LABELS.view}</span>
        </Link>
      </Button>
      <VendorKycDocumentsMenuAction vendorId={vendorId} vendorName={name} />
      {row.status === "SUSPENDED" ? (
        <AdminConfirmAction
          label={LABELS.unsuspend}
          dialogVariant="info"
          tone="neutral"
          title={LABELS.confirmUnsuspendVendorTitle}
          description={formatLabel(LABELS.confirmUnsuspendVendorBody, { name })}
          onConfirm={() => adminApi.unsuspendVendor(vendorId).then(onReload)}
        />
      ) : row.status === "APPROVED" ? (
        <AdminConfirmAction
          label={LABELS.suspend}
          dialogVariant="warning"
          tone="neutral"
          title={LABELS.confirmSuspendVendorTitle}
          description={formatLabel(LABELS.confirmSuspendVendorBody, { name })}
          requireReason
          reasonHint={LABELS.enterSuspendReason}
          onConfirm={(reason) =>
            adminApi.suspendVendor(vendorId, reason ?? "").then(onReload)
          }
        />
      ) : null}
      <AdminConfirmAction
        label={LABELS.delete}
        dialogVariant="danger"
        tone="danger"
        title={LABELS.confirmDeleteVendorTitle}
        description={formatLabel(LABELS.confirmDeleteVendorBody, { name })}
        onConfirm={() => adminApi.deleteVendor(vendorId).then(onReload)}
      />
    </>
  );
}

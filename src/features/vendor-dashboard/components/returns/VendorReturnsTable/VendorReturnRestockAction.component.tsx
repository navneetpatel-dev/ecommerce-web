"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { Button } from "@/shared/components/ui/button";
import { AdminConfirmAction } from "@/features/admin-dashboard";
import { useVendorReturnRestock } from "../../../hooks/returns/useVendorReturnRestock.hook";
import { useVendorReturnDispute } from "../../../hooks/returns/useVendorReturnDispute.hook";
import { VendorReturnDisputeDialog } from "../VendorReturnDisputeDialog.component";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";
import { vendorReturnsTableStyles } from "../../../styles/returns/vendorReturnsTable.styles";

interface VendorReturnRestockActionProps {
  row: VendorReturnRowViewModel;
}

/** Restock and dispute controls for a returned package. */
export function VendorReturnRestockAction({
  row,
}: VendorReturnRestockActionProps) {
  const [disputeOpen, setDisputeOpen] = useState(false);
  const { handleRestock } = useVendorReturnRestock(row.id);
  const { handleDispute, isSubmitting: disputeSubmitting } =
    useVendorReturnDispute(row.id);

  if (row.restocked) {
    return (
      <span className={vendorReturnsTableStyles.restockedText}>
        {LABELS.returnRestocked}
      </span>
    );
  }

  if (row.isDisputed) {
    return (
      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
        Dispute:{" "}
        {row.disputeStatus === "PENDING" ? "Under Review" : row.disputeStatus}
      </span>
    );
  }

  if (!row.canRestock && !row.canDispute) {
    return (
      <span className={vendorReturnsTableStyles.restockedText}>
        {LABELS.emptyCell}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {row.canRestock ? (
        <AdminConfirmAction
          label={LABELS.returnRestock}
          tone="neutral"
          title={LABELS.confirmRestockReturnTitle}
          description={formatLabel(LABELS.confirmRestockReturnBody, {
            name: row.productLabel,
          })}
          onConfirm={handleRestock}
        />
      ) : null}

      {row.canDispute ? (
        <>
          <Button
            size="sm"
            variant="ghost"
            type="button"
            className="text-xs text-destructive hover:bg-destructive/10 h-8 px-2"
            onClick={() => setDisputeOpen(true)}
          >
            Dispute
          </Button>

          <VendorReturnDisputeDialog
            open={disputeOpen}
            productName={row.productLabel}
            submitting={disputeSubmitting}
            onOpenChange={setDisputeOpen}
            onSubmit={async (data) => {
              await handleDispute(data);
              setDisputeOpen(false);
            }}
          />
        </>
      ) : null}
    </div>
  );
}

"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { Button } from "@/shared/components/ui/button";
import { AdminConfirmAction } from "@/features/admin-dashboard";
import { VendorReturnDisputeDialog } from "../VendorReturnDisputeDialog.component";
import { useVendorReturnRestockAction } from "../../../hooks/returns/useVendorReturnRestockAction.hook";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";
import { vendorReturnsTableStyles as styles } from "../../../styles/returns/vendorReturnsTable.styles";

interface VendorReturnRestockActionProps {
  row: VendorReturnRowViewModel;
}

/** Restock and dispute controls for a returned package. */
export function VendorReturnRestockAction({
  row,
}: VendorReturnRestockActionProps) {
  const {
    disputeOpen,
    disputeSubmitting,
    handleOpenDispute,
    handleDisputeOpenChange,
    handleRestock,
    handleDisputeSubmit,
  } = useVendorReturnRestockAction({ row });

  if (row.restocked) {
    return (
      <span className={styles.restockedText}>{LABELS.returnRestocked}</span>
    );
  }

  if (row.isDisputed) {
    const disputeLabel =
      row.disputeStatus === "PENDING" ? "Under Review" : row.disputeStatus;
    return <span className={styles.disputeBadge}>Dispute: {disputeLabel}</span>;
  }

  if (!row.canRestock && !row.canDispute) {
    return <span className={styles.restockedText}>{LABELS.emptyCell}</span>;
  }

  return (
    <div className={styles.restockContainer}>
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
            className={styles.disputeBtn}
            onClick={handleOpenDispute}
          >
            Dispute
          </Button>

          <VendorReturnDisputeDialog
            open={disputeOpen}
            productName={row.productLabel}
            submitting={disputeSubmitting}
            onOpenChange={handleDisputeOpenChange}
            onSubmit={handleDisputeSubmit}
          />
        </>
      ) : null}
    </div>
  );
}

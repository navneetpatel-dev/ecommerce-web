"use client";

import { Flag, PackagePlus } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
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
      row.disputeStatus === "PENDING"
        ? "Under Review"
        : (row.disputeStatus ?? "Disputed");
    return (
      <StatusBadge
        status={
          row.disputeStatus === "PENDING"
            ? "PENDING"
            : (row.disputeStatus ?? "DISPUTED")
        }
        label={`Dispute: ${disputeLabel}`}
      />
    );
  }

  if (!row.canRestock && !row.canDispute) {
    return <span className={styles.restockedText}>{LABELS.emptyCell}</span>;
  }

  return (
    <>
      <TableRowActions>
        {row.canRestock ? (
          <AdminConfirmAction
            label={LABELS.returnRestock}
            icon={PackagePlus}
            tone="neutral"
            title={LABELS.confirmRestockReturnTitle}
            description={formatLabel(LABELS.confirmRestockReturnBody, {
              name: row.productLabel,
            })}
            onConfirm={handleRestock}
          />
        ) : null}
        {row.canDispute ? (
          <RowActionButton
            icon={Flag}
            label={LABELS.returnDispute}
            onClick={handleOpenDispute}
          />
        ) : null}
      </TableRowActions>

      {row.canDispute ? (
        <VendorReturnDisputeDialog
          open={disputeOpen}
          productName={row.productLabel}
          submitting={disputeSubmitting}
          onOpenChange={handleDisputeOpenChange}
          onSubmit={handleDisputeSubmit}
        />
      ) : null}
    </>
  );
}

"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { AdminConfirmAction } from "@/features/admin-dashboard";
import { useVendorReturnRestock } from "../../../hooks/returns/useVendorReturnRestock.hook";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";
import { vendorReturnsTableStyles } from "../../../styles/returns/vendorReturnsTable.styles";

interface VendorReturnRestockActionProps {
  row: VendorReturnRowViewModel;
}

/** Restock control for a picked-up return; shows "Restocked" once done. */
export function VendorReturnRestockAction({
  row,
}: VendorReturnRestockActionProps) {
  const { handleRestock } = useVendorReturnRestock(row.id);

  if (row.restocked) {
    return (
      <span className={vendorReturnsTableStyles.restockedText}>
        {LABELS.returnRestocked}
      </span>
    );
  }
  if (!row.canRestock) {
    return (
      <span className={vendorReturnsTableStyles.restockedText}>
        {LABELS.emptyCell}
      </span>
    );
  }
  return (
    <AdminConfirmAction
      label={LABELS.returnRestock}
      tone="neutral"
      title={LABELS.confirmRestockReturnTitle}
      description={formatLabel(LABELS.confirmRestockReturnBody, {
        name: row.productLabel,
      })}
      onConfirm={handleRestock}
    />
  );
}

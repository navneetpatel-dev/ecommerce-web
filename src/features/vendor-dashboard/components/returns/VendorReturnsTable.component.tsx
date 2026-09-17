"use client";

import { LABELS } from "@/shared/constants/labels";
import type { ReturnRequest } from "@/shared/api/types";
import { useVendorReturnsTablePresentation } from "../../hooks/returns/useVendorReturnsTablePresentation.hook";
import { vendorReturnsTableStyles } from "../../styles/returns/vendorReturnsTable.styles";
import {
  VendorReturnCards,
  VendorReturnsDesktopTable,
} from "./VendorReturnsTable";

interface VendorReturnsTableProps {
  returns: ReturnRequest[];
}

export function VendorReturnsTable({ returns }: VendorReturnsTableProps) {
  const { rows, isEmpty } = useVendorReturnsTablePresentation(returns);

  return (
    <div>
      <h2 className={vendorReturnsTableStyles.title}>
        {LABELS.returnsPageTitle}
      </h2>
      <p className={vendorReturnsTableStyles.hint}>{LABELS.vendorReturnsHint}</p>
      <VendorReturnCards rows={rows} isEmpty={isEmpty} />
      <VendorReturnsDesktopTable rows={rows} isEmpty={isEmpty} />
    </div>
  );
}

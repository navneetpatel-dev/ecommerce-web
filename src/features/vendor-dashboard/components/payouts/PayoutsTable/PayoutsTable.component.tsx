"use client";

import { LABELS } from "@/shared/constants/labels";
import type { PayoutEntry } from "@/shared/api/types";
import { payoutsTableStyles } from "../../../styles/payouts/payoutsTable.styles";
import { usePayoutsTablePresentation } from "../../../hooks/payouts/usePayoutsTablePresentation.hook";
import { PayoutMobileList } from "./PayoutMobileList.component";
import { PayoutDesktopTable } from "./PayoutDesktopTable.component";

interface PayoutsTableProps {
  payouts?: { items?: PayoutEntry[] };
}

export function PayoutsTable({ payouts }: PayoutsTableProps) {
  const { isEmpty, rows } = usePayoutsTablePresentation(payouts);

  return (
    <div>
      <h2 className={payoutsTableStyles.title}>{LABELS.payouts}</h2>
      <PayoutMobileList rows={rows} isEmpty={isEmpty} />
      <PayoutDesktopTable rows={rows} isEmpty={isEmpty} />
    </div>
  );
}

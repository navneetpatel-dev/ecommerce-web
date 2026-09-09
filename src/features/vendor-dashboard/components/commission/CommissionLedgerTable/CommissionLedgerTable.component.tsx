"use client";

import { commissionLedgerTableStyles } from "../../../styles/commission/commissionLedgerTable.styles";
import {
  useCommissionLedgerPresentation,
  type Commission,
} from "../../../hooks/commission/useCommissionLedgerPresentation.hook";
import { CommissionMobileList } from "./CommissionMobileList.component";
import { CommissionDesktopTable } from "./CommissionDesktopTable.component";

interface CommissionLedgerTableProps {
  commissions?: { items?: Commission[] };
}

export function CommissionLedgerTable({
  commissions,
}: CommissionLedgerTableProps) {
  const { isEmpty, rows } = useCommissionLedgerPresentation(commissions);

  return (
    <div>
      <h2 className={commissionLedgerTableStyles.title}>Commission Ledger</h2>
      <CommissionMobileList rows={rows} isEmpty={isEmpty} />
      <CommissionDesktopTable rows={rows} isEmpty={isEmpty} />
    </div>
  );
}

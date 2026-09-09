import type { CashDeposit } from "@/features/delivery-dashboard";
import { CashDepositTableRow } from "./CashDepositTableRow.component";

interface CashDepositTableBodyProps {
  deposits: CashDeposit[];
  pendingId: string | null;
  onAct: (depositId: string, action: "VERIFY" | "REJECT") => Promise<void>;
}

export function CashDepositTableBody({
  deposits,
  pendingId,
  onAct,
}: CashDepositTableBodyProps) {
  return (
    <tbody>
      {deposits.map((deposit) => (
        <CashDepositTableRow
          key={deposit.id}
          deposit={deposit}
          pendingId={pendingId}
          onAct={onAct}
        />
      ))}
    </tbody>
  );
}

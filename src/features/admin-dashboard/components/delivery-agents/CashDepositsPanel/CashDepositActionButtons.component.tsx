import { useCallback } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cashDepositsPanelStyles } from "./cashDepositsPanel.styles";

interface CashDepositActionButtonsProps {
  depositId: string;
  isPending: boolean;
  onAct: (depositId: string, action: "VERIFY" | "REJECT") => Promise<void>;
}

export function CashDepositActionButtons({
  depositId,
  isPending,
  onAct,
}: CashDepositActionButtonsProps) {
  const handleVerify = useCallback(() => {
    void onAct(depositId, "VERIFY");
  }, [depositId, onAct]);

  const handleReject = useCallback(() => {
    void onAct(depositId, "REJECT");
  }, [depositId, onAct]);

  return (
    <div className={cashDepositsPanelStyles.actionsWrapper}>
      <Button
        size="sm"
        variant="outline"
        className={cashDepositsPanelStyles.verifyButton}
        loading={isPending}
        onClick={handleVerify}
      >
        <CheckCircle2
          className={cashDepositsPanelStyles.actionIcon}
          aria-hidden="true"
        />
        Verify
      </Button>
      <Button
        size="sm"
        variant="outline"
        className={cashDepositsPanelStyles.rejectButton}
        loading={isPending}
        onClick={handleReject}
      >
        <XCircle
          className={cashDepositsPanelStyles.actionIcon}
          aria-hidden="true"
        />
        Reject
      </Button>
    </div>
  );
}

import { useCallback } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { cashDepositsPanelStyles } from "../../../styles/delivery-agents/cashDepositsPanel.styles";

interface CashDepositActionButtonsProps {
  depositId: string;
  isPending: boolean;
  onVerify: (depositId: string) => void;
  onReject: (depositId: string) => void;
}

export function CashDepositActionButtons({
  depositId,
  isPending,
  onVerify,
  onReject,
}: CashDepositActionButtonsProps) {
  const handleVerify = useCallback(() => {
    onVerify(depositId);
  }, [depositId, onVerify]);

  const handleReject = useCallback(() => {
    onReject(depositId);
  }, [depositId, onReject]);

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
        {LABELS.verifyDocument}
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
        {LABELS.reject}
      </Button>
    </div>
  );
}

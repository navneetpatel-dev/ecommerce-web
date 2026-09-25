"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  SHIFT_DIALOG_BODY,
  SHIFT_DIALOG_CONTENT,
  SHIFT_DIALOG_ERROR,
  SHIFT_DIALOG_HINT,
  SHIFT_DIALOG_SUBMIT,
} from "../../../styles/today/shiftSummaryCard.styles";
import type { useShiftSummaryCard } from "../../../hooks/today/useShiftSummaryCard.hook";
import { formatInrExact } from "@/shared/utils/formatting/orderFormat";

interface CashDepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expectedCod: number;
  amount: string;
  note: string;
  error: string | null;
  isPending: boolean;
  isSubmitDisabled: boolean;
  onAmountChange: ReturnType<typeof useShiftSummaryCard>["handleAmountChange"];
  onNoteChange: ReturnType<typeof useShiftSummaryCard>["handleNoteChange"];
  onSubmit: () => void;
}

export function CashDepositDialog({
  open,
  onOpenChange,
  expectedCod,
  amount,
  note,
  error,
  isPending,
  isSubmitDisabled,
  onAmountChange,
  onNoteChange,
  onSubmit,
}: CashDepositDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={SHIFT_DIALOG_CONTENT}>
        <DialogHeader>
          <DialogTitle>Deposit COD cash</DialogTitle>
        </DialogHeader>
        <div className={SHIFT_DIALOG_BODY}>
          <p className={SHIFT_DIALOG_HINT}>
            Declare the cash you&apos;re handing to the hub. The system expects
            {formatInrExact(expectedCod)} based on collected COD orders.
          </p>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={onAmountChange}
            placeholder="Amount deposited"
          />
          <Input
            value={note}
            onChange={onNoteChange}
            placeholder="Note (optional)"
          />
          {error ? <p className={SHIFT_DIALOG_ERROR}>{error}</p> : null}
          <Button
            className={SHIFT_DIALOG_SUBMIT}
            disabled={isSubmitDisabled}
            loading={isPending}
            onClick={onSubmit}
          >
            Submit deposit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

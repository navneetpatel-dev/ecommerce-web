"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { FormFieldFrame } from "@/shared/components/forms";
import { DiscardChangesDialog } from "@/shared/components/dialogs/DiscardChangesDialog.component";
import { useDiscardChangesGuard } from "@/shared/hooks/dialogs/useDiscardChangesGuard.hook";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
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
  isDirty: boolean;
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
  isDirty,
  onAmountChange,
  onNoteChange,
  onSubmit,
}: CashDepositDialogProps) {
  const guard = useDiscardChangesGuard(isDirty);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }
    if (isPending) return;
    guard.requestClose(() => onOpenChange(false));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={SHIFT_DIALOG_CONTENT}>
          <DialogHeader>
            <DialogTitle>{LABELS.depositDialogTitle}</DialogTitle>
          </DialogHeader>
          <div className={SHIFT_DIALOG_BODY}>
            <DialogDescription className={SHIFT_DIALOG_HINT}>
              {formatLabel(LABELS.depositDialogHint, {
                amount: formatInrExact(expectedCod),
              })}
            </DialogDescription>
            <FormFieldFrame
              label={LABELS.depositAmountLabel}
              htmlFor="cash-deposit-amount"
              required
            >
              <Input
                id="cash-deposit-amount"
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={onAmountChange}
              />
            </FormFieldFrame>
            <FormFieldFrame
              label={LABELS.depositNoteLabel}
              htmlFor="cash-deposit-note"
            >
              <Input
                id="cash-deposit-note"
                value={note}
                onChange={onNoteChange}
              />
            </FormFieldFrame>
            {error ? (
              <p role="alert" className={SHIFT_DIALOG_ERROR}>
                {error}
              </p>
            ) : null}
            <Button
              className={SHIFT_DIALOG_SUBMIT}
              disabled={isSubmitDisabled}
              loading={isPending}
              onClick={onSubmit}
            >
              {LABELS.submitDeposit}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <DiscardChangesDialog
        open={guard.confirmOpen}
        onOpenChange={guard.handleConfirmOpenChange}
        onDiscard={guard.confirmDiscard}
        onKeepEditing={guard.cancelDiscard}
      />
    </>
  );
}

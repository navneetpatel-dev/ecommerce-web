import { useState, type ChangeEvent } from "react";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { useCloseCashShift } from "../../api/deliveryAgent.queries";
import type { ShiftSummary } from "../../types";

export function useShiftSummaryCard(summary: ShiftSummary) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(() => String(summary.codCashInHand));
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const closeShift = useCloseCashShift();

  const openDialog = () => {
    setAmount(String(summary.codCashInHand));
    setNote("");
    setError(null);
    setOpen(true);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const submit = async () => {
    setError(null);
    try {
      await closeShift.mutateAsync({
        amount: Number(amount),
        note: note || undefined,
      });
      setOpen(false);
    } catch (submitError) {
      setError(
        getApiErrorMessage(submitError, "Could not submit cash deposit."),
      );
    }
  };

  const handleSubmit = () => {
    void submit();
  };

  const isSubmitDisabled = !amount || Number(amount) < 0;

  return {
    open,
    setOpen,
    amount,
    note,
    error,
    isPending: closeShift.isPending,
    isSubmitDisabled,
    openDialog,
    handleAmountChange,
    handleNoteChange,
    handleSubmit,
  };
}

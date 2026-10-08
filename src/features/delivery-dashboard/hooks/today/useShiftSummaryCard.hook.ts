import { useState, type ChangeEvent } from "react";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { useCloseCashShift } from "../../api/agent/deliveryAgent.queries";
import type { ShiftSummary } from "../../types/agent/types";

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
    // text + inputMode=decimal: strip non-numeric and collapse to one dot so
    // the draft can never hold "12.3.4" or stray letters.
    const cleaned = e.target.value.replace(/[^0-9.]/g, "");
    const [whole, ...decimals] = cleaned.split(".");
    setAmount(decimals.length ? `${whole}.${decimals.join("")}` : whole);
  };

  const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const isDirty = amount !== String(summary.codCashInHand) || note.length > 0;

  const submit = async () => {
    setError(null);
    try {
      await closeShift.mutateAsync({
        amount: Number(amount),
        note: note || undefined,
      });
      setOpen(false);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, LABELS.depositFailedFallback));
    }
  };

  const handleSubmit = () => {
    void submit();
  };

  const isSubmitDisabled =
    !amount || !Number.isFinite(Number(amount)) || Number(amount) < 0;

  return {
    open,
    setOpen,
    amount,
    note,
    error,
    isDirty,
    isPending: closeShift.isPending,
    isSubmitDisabled,
    openDialog,
    handleAmountChange,
    handleNoteChange,
    handleSubmit,
  };
}

"use client";

import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { useUpdateBankDetails } from "../../api/agent/deliveryAgent.queries";
import type { BankDetails } from "../../types/agent/types";

const EMPTY: BankDetails = {
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",
};

export function useBankDetailsCardPresentation(
  bankDetails?: BankDetails | null,
) {
  const [prevBankDetails, setPrevBankDetails] = useState(bankDetails);
  const [form, setForm] = useState<BankDetails>(bankDetails ?? EMPTY);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const update = useUpdateBankDetails();

  if (bankDetails !== prevBankDetails) {
    setPrevBankDetails(bankDetails);
    if (bankDetails) {
      setForm(bankDetails);
    }
  }

  const setField = useCallback(
    <K extends keyof BankDetails>(field: K, value: BankDetails[K]) => {
      setForm((current) => ({ ...current, [field]: value }));
      setMessage(null);
    },
    [],
  );

  const handleAccountHolderNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField("accountHolderName", e.target.value);
    },
    [setField],
  );

  const handleAccountNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField("accountNumber", e.target.value);
    },
    [setField],
  );

  const handleIfscCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField("ifscCode", e.target.value.toUpperCase());
    },
    [setField],
  );

  const handleUpiIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField("upiId", e.target.value);
    },
    [setField],
  );

  const canSave =
    form.accountHolderName.trim().length > 0 &&
    form.accountNumber.trim().length >= 4 &&
    /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(form.ifscCode.trim());
  const saveDisabled = !canSave;

  const handleSave = useCallback(async () => {
    setError(null);
    try {
      await update.mutateAsync({
        accountHolderName: form.accountHolderName.trim(),
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.trim().toUpperCase(),
        upiId: form.upiId?.trim() || undefined,
      });
      setMessage("Payout details saved.");
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, "Could not save payout details."));
    }
  }, [form, update]);

  return {
    form,
    message,
    error,
    saveDisabled,
    isPending: update.isPending,
    handleAccountHolderNameChange,
    handleAccountNumberChange,
    handleIfscCodeChange,
    handleUpiIdChange,
    handleSave,
  };
}

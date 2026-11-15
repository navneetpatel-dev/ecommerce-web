"use client";

import { useState, useCallback, type ChangeEvent } from "react";
import type { VendorBankDetails } from "../../api/overview/vendor.api";

interface UseBankDetailsSectionOptions {
  bankDetails: VendorBankDetails | null;
  onChange: (details: VendorBankDetails) => void;
}

export function useBankDetailsSection({
  bankDetails,
  onChange,
}: UseBankDetailsSectionOptions) {
  const [confirmAccount, setConfirmAccount] = useState(
    bankDetails?.accountNumber ?? "",
  );
  const [confirmTouched, setConfirmTouched] = useState(false);

  const handleHolderNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...(bankDetails ?? {}),
        accountHolderName: e.target.value,
      });
    },
    [bankDetails, onChange],
  );

  const handleBankNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...(bankDetails ?? {}),
        bankName: e.target.value,
      });
    },
    [bankDetails, onChange],
  );

  const handleAccountNumberChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...(bankDetails ?? {}),
        accountNumber: e.target.value,
      });
    },
    [bankDetails, onChange],
  );

  const handleConfirmChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setConfirmAccount(e.target.value);
      setConfirmTouched(true);
    },
    [],
  );

  const handleIfscCodeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...(bankDetails ?? {}),
        ifscCode: e.target.value,
      });
    },
    [bankDetails, onChange],
  );

  const isMismatch =
    confirmTouched && confirmAccount !== (bankDetails?.accountNumber ?? "");

  const maskedAccountNumber = bankDetails?.accountNumber
    ? `••••••••${bankDetails.accountNumber.slice(-4)}`
    : "Not configured";

  return {
    confirmAccount,
    isMismatch,
    maskedAccountNumber,
    handleHolderNameChange,
    handleBankNameChange,
    handleAccountNumberChange,
    handleConfirmChange,
    handleIfscCodeChange,
  };
}

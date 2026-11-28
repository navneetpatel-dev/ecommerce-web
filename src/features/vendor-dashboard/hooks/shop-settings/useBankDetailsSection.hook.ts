"use client";

import { useCallback, type ChangeEvent } from "react";
import type { VendorBankDetails } from "../../api/overview/vendor.api";

interface UseBankDetailsSectionOptions {
  bankDetails: VendorBankDetails | null;
  onChange: (details: VendorBankDetails) => void;
  /** Account number as last saved: only an edit to it needs re-confirming. */
  savedAccountNumber: string;
  confirmAccount: string;
  onConfirmChange: (value: string) => void;
}

const ACCOUNT_NUMBER = /^\d{9,18}$/;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/i;

export function useBankDetailsSection({
  bankDetails,
  onChange,
  savedAccountNumber,
  confirmAccount,
  onConfirmChange,
}: UseBankDetailsSectionOptions) {
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
      onConfirmChange(e.target.value);
    },
    [onConfirmChange],
  );

  const handleIfscCodeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...(bankDetails ?? {}),
        ifscCode: e.target.value.toUpperCase(),
      });
    },
    [bankDetails, onChange],
  );

  const accountNumber = bankDetails?.accountNumber ?? "";
  const accountEdited = accountNumber !== savedAccountNumber;
  const accountInvalid = accountEdited && !ACCOUNT_NUMBER.test(accountNumber);
  // An edited number is never trusted until it has been typed a second time.
  const isMismatch =
    accountEdited && !accountInvalid && confirmAccount !== accountNumber;
  const ifscInvalid =
    Boolean(bankDetails?.ifscCode) && !IFSC.test(bankDetails?.ifscCode ?? "");

  return {
    accountInvalid,
    ifscInvalid,
    isMismatch,
    handleHolderNameChange,
    handleBankNameChange,
    handleAccountNumberChange,
    handleConfirmChange,
    handleIfscCodeChange,
  };
}

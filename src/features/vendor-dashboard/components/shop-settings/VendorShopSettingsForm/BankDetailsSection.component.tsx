"use client";

import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import type { VendorBankDetails } from "../../../api/overview/vendor.api";
import { useBankDetailsSection } from "../../../hooks/shop-settings/useBankDetailsSection.hook";
import { vendorShopSettingsFormStyles as styles } from "../../../styles/shop-settings/vendorShopSettingsForm.styles";

interface BankDetailsSectionProps {
  bankDetails: VendorBankDetails | null;
  onChange: (details: VendorBankDetails) => void;
  savedAccountNumber: string;
  confirmAccount: string;
  onConfirmChange: (value: string) => void;
}

export function BankDetailsSection({
  bankDetails,
  onChange,
  savedAccountNumber,
  confirmAccount,
  onConfirmChange,
}: BankDetailsSectionProps) {
  const {
    accountInvalid,
    ifscInvalid,
    isMismatch,
    handleHolderNameChange,
    handleBankNameChange,
    handleAccountNumberChange,
    handleConfirmChange,
    handleIfscCodeChange,
  } = useBankDetailsSection({
    bankDetails,
    onChange,
    savedAccountNumber,
    confirmAccount,
    onConfirmChange,
  });

  return (
    <FormSection
      title="Bank Settlement Details"
      hint="Bank account used for processing automated payout settlements (NEFT/RTGS)."
      columns={2}
    >
      <FormFieldFrame
        label="Account Holder Name"
        hint="Name as registered with the bank"
        className={styles.inputCol}
      >
        <Input
          value={bankDetails?.accountHolderName ?? ""}
          onChange={handleHolderNameChange}
          placeholder="e.g. Acme Enterprises"
        />
      </FormFieldFrame>

      <FormFieldFrame
        label="Bank Name"
        hint="Full name of banking institution"
        className={styles.inputCol}
      >
        <Input
          value={bankDetails?.bankName ?? ""}
          onChange={handleBankNameChange}
          placeholder="e.g. HDFC Bank"
        />
      </FormFieldFrame>

      <FormFieldFrame
        label="Account Number"
        hint="Bank account number for payouts"
        className={styles.inputCol}
      >
        <Input
          type="password"
          value={bankDetails?.accountNumber ?? ""}
          onChange={handleAccountNumberChange}
          placeholder="Enter account number"
          inputMode="numeric"
          autoComplete="off"
        />
        {accountInvalid ? (
          <p className={styles.bankDetailsMismatchText}>
            {LABELS.bankAccountNumberInvalid}
          </p>
        ) : null}
      </FormFieldFrame>

      <FormFieldFrame
        label="Confirm Account Number"
        hint="Re-type account number for verification"
        className={styles.inputCol}
      >
        <Input
          value={confirmAccount}
          onChange={handleConfirmChange}
          placeholder="Re-enter account number"
          inputMode="numeric"
          autoComplete="off"
        />
        {isMismatch ? (
          <p className={styles.bankDetailsMismatchText}>
            {LABELS.bankAccountNumbersMismatch}
          </p>
        ) : null}
      </FormFieldFrame>

      <FormFieldFrame
        label="IFSC Code"
        hint="11-character Indian Financial System Code"
        className={styles.inputCol}
      >
        <Input
          value={bankDetails?.ifscCode ?? ""}
          onChange={handleIfscCodeChange}
          placeholder="e.g. HDFC0001234"
          className={styles.ifscInput}
          maxLength={11}
        />
        {ifscInvalid ? (
          <p className={styles.bankDetailsMismatchText}>
            {LABELS.bankIfscInvalid}
          </p>
        ) : null}
      </FormFieldFrame>
    </FormSection>
  );
}

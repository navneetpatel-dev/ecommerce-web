"use client";

import { useState, type ChangeEvent } from "react";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import type { VendorBankDetails } from "../../../api/overview/vendor.api";
import { vendorShopSettingsFormStyles } from "../../../styles/shop-settings/vendorShopSettingsForm.styles";

interface BankDetailsSectionProps {
  bankDetails: VendorBankDetails | null;
  onChange: (details: VendorBankDetails) => void;
  isOwner?: boolean;
}

export function BankDetailsSection({
  bankDetails,
  onChange,
  isOwner = true,
}: BankDetailsSectionProps) {
  const [confirmAccount, setConfirmAccount] = useState(
    bankDetails?.accountNumber ?? "",
  );
  const [confirmTouched, setConfirmTouched] = useState(false);

  const handleFieldChange =
    (field: keyof VendorBankDetails) => (e: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...(bankDetails ?? {}),
        [field]: e.target.value,
      });
    };

  const handleConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmAccount(e.target.value);
    setConfirmTouched(true);
  };

  const isMismatch =
    confirmTouched && confirmAccount !== (bankDetails?.accountNumber ?? "");

  const maskedAccountNumber = bankDetails?.accountNumber
    ? `••••••••${bankDetails.accountNumber.slice(-4)}`
    : "Not configured";

  return (
    <FormSection
      title="Bank Settlement Details"
      hint="Bank account used for processing automated payout settlements (NEFT/RTGS)."
      columns={2}
    >
      {!isOwner ? (
        <div className="col-span-full rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Account Number (Masked)
          </p>
          <p className="mt-1 font-mono text-sm text-neutral-600 dark:text-neutral-400">
            {maskedAccountNumber}
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Only the store proprietor (Vendor Owner) can view and modify bank
            account details.
          </p>
        </div>
      ) : (
        <>
          <FormFieldFrame
            label="Account Holder Name"
            hint="Name as registered with the bank"
            className={vendorShopSettingsFormStyles.inputCol}
          >
            <Input
              value={bankDetails?.accountHolderName ?? ""}
              onChange={handleFieldChange("accountHolderName")}
              placeholder="e.g. Acme Enterprises"
            />
          </FormFieldFrame>

          <FormFieldFrame
            label="Bank Name"
            hint="Full name of banking institution"
            className={vendorShopSettingsFormStyles.inputCol}
          >
            <Input
              value={bankDetails?.bankName ?? ""}
              onChange={handleFieldChange("bankName")}
              placeholder="e.g. HDFC Bank"
            />
          </FormFieldFrame>

          <FormFieldFrame
            label="Account Number"
            hint="Bank account number for payouts"
            className={vendorShopSettingsFormStyles.inputCol}
          >
            <Input
              type="password"
              value={bankDetails?.accountNumber ?? ""}
              onChange={handleFieldChange("accountNumber")}
              placeholder="Enter account number"
            />
          </FormFieldFrame>

          <FormFieldFrame
            label="Confirm Account Number"
            hint="Re-type account number for verification"
            className={vendorShopSettingsFormStyles.inputCol}
          >
            <Input
              value={confirmAccount}
              onChange={handleConfirmChange}
              placeholder="Re-enter account number"
            />
            {isMismatch ? (
              <p className="mt-1 text-xs text-red-500">
                Account numbers do not match
              </p>
            ) : null}
          </FormFieldFrame>

          <FormFieldFrame
            label="IFSC Code"
            hint="11-character Indian Financial System Code"
            className={vendorShopSettingsFormStyles.inputCol}
          >
            <Input
              value={bankDetails?.ifscCode ?? ""}
              onChange={handleFieldChange("ifscCode")}
              placeholder="e.g. HDFC0001234"
              className="uppercase"
              maxLength={11}
            />
          </FormFieldFrame>
        </>
      )}
    </FormSection>
  );
}

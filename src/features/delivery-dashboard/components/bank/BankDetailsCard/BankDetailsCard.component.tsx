"use client";

import { Landmark } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import type { BankDetails } from "../../../types/agent/types";
import { bankDetailsCardStyles } from "../../../styles/bank/bankDetailsCard.styles";
import { useBankDetailsCardPresentation } from "../../../hooks/bank/useBankDetailsCardPresentation.hook";
import { BankDetailsFormFields } from "./BankDetailsFormFields.component";

interface BankDetailsCardProps {
  bankDetails?: BankDetails | null;
}

/** Payout destination — required before any payout can be marked paid to this agent. */
export function BankDetailsCard({ bankDetails }: BankDetailsCardProps) {
  const {
    form,
    message,
    error,
    saveDisabled,
    isPending,
    handleAccountHolderNameChange,
    handleAccountNumberChange,
    handleIfscCodeChange,
    handleUpiIdChange,
    handleSave,
  } = useBankDetailsCardPresentation(bankDetails);

  return (
    <section className={bankDetailsCardStyles.container}>
      <div className={bankDetailsCardStyles.header}>
        <div className={bankDetailsCardStyles.headerTop}>
          <Landmark
            className={bankDetailsCardStyles.headerIcon}
            aria-hidden="true"
          />
          <TextEyebrow className={bankDetailsCardStyles.headerEyebrow}>
            PAYOUT DESTINATION
          </TextEyebrow>
        </div>
        <h2 className={bankDetailsCardStyles.title}>Bank / UPI details</h2>
        <p className={bankDetailsCardStyles.subtitle}>
          Where your delivery earnings are paid out. Required before a payout
          can be marked paid.
        </p>
      </div>

      <div className={bankDetailsCardStyles.body}>
        <BankDetailsFormFields
          form={form}
          onAccountHolderNameChange={handleAccountHolderNameChange}
          onAccountNumberChange={handleAccountNumberChange}
          onIfscCodeChange={handleIfscCodeChange}
          onUpiIdChange={handleUpiIdChange}
        />

        {message ? (
          <p className={bankDetailsCardStyles.successMessage}>{message}</p>
        ) : null}
        {error ? (
          <p className={bankDetailsCardStyles.errorMessage}>{error}</p>
        ) : null}

        <Button
          className={bankDetailsCardStyles.submitButton}
          disabled={saveDisabled}
          loading={isPending}
          onClick={handleSave}
        >
          Save payout details
        </Button>
      </div>
    </section>
  );
}

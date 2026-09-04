"use client";

import { useEffect, useState } from "react";
import { Landmark } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame } from "@/shared/components/forms";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { useUpdateBankDetails } from "../api/deliveryAgent.queries";
import type { BankDetails } from "../types";

const EMPTY: BankDetails = {
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",
};

/** Payout destination — required before any payout can be marked paid to this agent. */
export function BankDetailsCard({
  bankDetails,
}: {
  bankDetails?: BankDetails | null;
}) {
  const [form, setForm] = useState<BankDetails>(bankDetails ?? EMPTY);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const update = useUpdateBankDetails();

  useEffect(() => {
    if (bankDetails) setForm(bankDetails);
  }, [bankDetails]);

  const setField = <K extends keyof BankDetails>(
    field: K,
    value: BankDetails[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage(null);
  };

  const canSave =
    form.accountHolderName.trim().length > 0 &&
    form.accountNumber.trim().length >= 4 &&
    /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(form.ifscCode.trim());

  const save = async () => {
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
  };

  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <Landmark className="size-4 text-brand" aria-hidden="true" />
          <TextEyebrow className="!mb-0">PAYOUT DESTINATION</TextEyebrow>
        </div>
        <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
          Bank / UPI details
        </h2>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          Where your delivery earnings are paid out. Required before a payout
          can be marked paid.
        </p>
      </div>
      <div className="p-5 md:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormFieldFrame label="Account holder name" required>
            <Input
              value={form.accountHolderName}
              onChange={(e) => setField("accountHolderName", e.target.value)}
              maxLength={120}
            />
          </FormFieldFrame>
          <FormFieldFrame label="Account number" required>
            <Input
              value={form.accountNumber}
              onChange={(e) => setField("accountNumber", e.target.value)}
              maxLength={34}
            />
          </FormFieldFrame>
          <FormFieldFrame label="IFSC code" required>
            <Input
              value={form.ifscCode}
              onChange={(e) =>
                setField("ifscCode", e.target.value.toUpperCase())
              }
              maxLength={11}
              placeholder="SBIN0001234"
            />
          </FormFieldFrame>
          <FormFieldFrame label="UPI ID (optional)">
            <Input
              value={form.upiId ?? ""}
              onChange={(e) => setField("upiId", e.target.value)}
              placeholder="name@bank"
              maxLength={120}
            />
          </FormFieldFrame>
        </div>
        {message ? (
          <p className="mt-3 text-body-sm text-success">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-3 text-body-sm text-danger">{error}</p>
        ) : null}
        <Button
          className="mt-4"
          disabled={!canSave}
          loading={update.isPending}
          onClick={() => void save()}
        >
          Save payout details
        </Button>
      </div>
    </section>
  );
}

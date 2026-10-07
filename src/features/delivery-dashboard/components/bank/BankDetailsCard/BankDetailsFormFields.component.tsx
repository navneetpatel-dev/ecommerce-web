import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { bankDetailsCardStyles } from "../../../styles/bank/bankDetailsCard.styles";
import type { BankDetails } from "../../../types/agent/types";

interface BankDetailsFormFieldsProps {
  form: BankDetails;
  onAccountHolderNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAccountNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIfscCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpiIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPanChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BankDetailsFormFields({
  form,
  onAccountHolderNameChange,
  onAccountNumberChange,
  onIfscCodeChange,
  onUpiIdChange,
  onPanChange,
}: BankDetailsFormFieldsProps) {
  return (
    <div className={bankDetailsCardStyles.formGrid}>
      <FormFieldFrame label={LABELS.bankAccountHolder} required>
        <Input
          value={form.accountHolderName}
          onChange={onAccountHolderNameChange}
          maxLength={120}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.bankAccountNumber} required>
        <Input
          value={form.accountNumber}
          onChange={onAccountNumberChange}
          maxLength={34}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.bankIfscLabel} required>
        <Input
          value={form.ifscCode}
          onChange={onIfscCodeChange}
          maxLength={11}
          placeholder={LABELS.bankIfscPlaceholder}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.bankUpiLabel}>
        <Input
          value={form.upiId ?? ""}
          onChange={onUpiIdChange}
          placeholder={LABELS.bankUpiPlaceholder}
          maxLength={120}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.agentPanLabel} hint={LABELS.agentPanHint}>
        <Input
          value={form.pan ?? ""}
          onChange={onPanChange}
          placeholder={LABELS.agentPanPlaceholder}
          maxLength={10}
        />
      </FormFieldFrame>
    </div>
  );
}

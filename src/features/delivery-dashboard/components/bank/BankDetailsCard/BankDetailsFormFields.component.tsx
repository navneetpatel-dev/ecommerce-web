import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame } from "@/shared/components/forms";
import { bankDetailsCardStyles } from "../../../styles/bank/bankDetailsCard.styles";
import type { BankDetails } from "../../../types/agent/types";

interface BankDetailsFormFieldsProps {
  form: BankDetails;
  onAccountHolderNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAccountNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIfscCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpiIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BankDetailsFormFields({
  form,
  onAccountHolderNameChange,
  onAccountNumberChange,
  onIfscCodeChange,
  onUpiIdChange,
}: BankDetailsFormFieldsProps) {
  return (
    <div className={bankDetailsCardStyles.formGrid}>
      <FormFieldFrame label="Account holder name" required>
        <Input
          value={form.accountHolderName}
          onChange={onAccountHolderNameChange}
          maxLength={120}
        />
      </FormFieldFrame>
      <FormFieldFrame label="Account number" required>
        <Input
          value={form.accountNumber}
          onChange={onAccountNumberChange}
          maxLength={34}
        />
      </FormFieldFrame>
      <FormFieldFrame label="IFSC code" required>
        <Input
          value={form.ifscCode}
          onChange={onIfscCodeChange}
          maxLength={11}
          placeholder="SBIN0001234"
        />
      </FormFieldFrame>
      <FormFieldFrame label="UPI ID (optional)">
        <Input
          value={form.upiId ?? ""}
          onChange={onUpiIdChange}
          placeholder="name@bank"
          maxLength={120}
        />
      </FormFieldFrame>
    </div>
  );
}

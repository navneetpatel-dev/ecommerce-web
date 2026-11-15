"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { FilePicker } from "@/shared/components/FileUpload/FilePicker.component";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { PaymentMethodsList } from "./AdminMarkPayoutPaidAction/PaymentMethodsList.component";
import {
  PAYOUT_PAYMENT_METHODS,
  useAdminMarkPayoutPaidAction,
} from "../../hooks/finance/useAdminMarkPayoutPaidAction.hook";
import { adminMarkPayoutPaidActionStyles as styles } from "../../styles/finance/adminMarkPayoutPaidAction.styles";

interface AdminMarkPayoutPaidActionProps {
  payoutId: string;
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branchName?: string;
  } | null;
  onDone: () => void;
}

export function AdminMarkPayoutPaidAction({
  payoutId,
  bankDetails,
  onDone,
}: AdminMarkPayoutPaidActionProps) {
  const {
    open,
    method,
    reference,
    paidAt,
    remarks,
    proof,
    setProof,
    pending,
    error,
    openDialog,
    close,
    handleOpenChange,
    handleMethodChange,
    handleReferenceChange,
    handlePaidAtChange,
    handleRemarksChange,
    submit,
  } = useAdminMarkPayoutPaidAction({ payoutId, onDone });

  const errorMessage = error ? (
    <p role="alert" className={styles.errorMessage}>
      {error}
    </p>
  ) : null;

  return (
    <>
      <Button size="sm" variant="outline" onClick={openDialog}>
        <CheckCircle2 className={styles.icon} aria-hidden="true" />
        {LABELS.markPayoutPaid}
      </Button>
      <StatusDialog
        open={open}
        onOpenChange={handleOpenChange}
        variant="success"
        title={LABELS.markPaidFinanceDialogTitle}
        description={LABELS.markPaidFinanceDialogBody}
        secondaryAction={{
          label: LABELS.cancel,
          onClick: close,
          disabled: pending,
        }}
        primaryAction={{
          label: LABELS.markPayoutPaid,
          onClick: submit,
          loading: pending,
          disabled: !reference.trim(),
          disabledHint: LABELS.referenceRequiredHint,
        }}
      >
        {bankDetails ? (
          <div className="mb-4 rounded-lg border border-line bg-surface p-3 text-xs">
            <p className="font-semibold text-ink mb-1.5 flex items-center gap-1.5">
              <span>Settlement Account Details</span>
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-ink-muted">
              <div>
                <span className="text-ink-faint">Bank:</span>{" "}
                <span className="font-medium text-ink">
                  {bankDetails.bankName || "—"}
                </span>
              </div>
              <div>
                <span className="text-ink-faint">Account Holder:</span>{" "}
                <span className="font-medium text-ink">
                  {bankDetails.accountHolderName || "—"}
                </span>
              </div>
              <div>
                <span className="text-ink-faint">Account No:</span>{" "}
                <span className="font-mono font-medium text-ink">
                  {bankDetails.accountNumber || "—"}
                </span>
              </div>
              <div>
                <span className="text-ink-faint">IFSC:</span>{" "}
                <span className="font-mono font-medium text-ink">
                  {bankDetails.ifscCode || "—"}
                </span>
              </div>
              {bankDetails.branchName ? (
                <div className="col-span-2">
                  <span className="text-ink-faint">Branch:</span>{" "}
                  <span className="font-medium text-ink">
                    {bankDetails.branchName}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-lg border border-warning/30 bg-warning-subtle p-2.5 text-xs text-warning-foreground">
            No bank settlement details registered for this vendor.
          </div>
        )}
        <FormFieldFrame
          label={LABELS.paymentMethodLabel}
          htmlFor={`payout-method-${payoutId}`}
          required
        >
          <Select value={method} onValueChange={handleMethodChange}>
            <SelectTrigger id={`payout-method-${payoutId}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <PaymentMethodsList methods={PAYOUT_PAYMENT_METHODS} />
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.paymentReferenceLabel}
          htmlFor={`payout-reference-${payoutId}`}
          required
        >
          <Input
            id={`payout-reference-${payoutId}`}
            value={reference}
            maxLength={120}
            placeholder={LABELS.paymentReferencePlaceholder}
            onChange={handleReferenceChange}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.paidAtLabel}
          htmlFor={`payout-date-${payoutId}`}
        >
          <Input
            id={`payout-date-${payoutId}`}
            type="datetime-local"
            value={paidAt}
            onChange={handlePaidAtChange}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.proofOfPaymentLabel}
          htmlFor={`payout-proof-${payoutId}`}
        >
          <FilePicker
            id={`payout-proof-${payoutId}`}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            maxBytes={5 * 1024 * 1024}
            value={proof}
            onChange={setProof}
            disabled={pending}
            hint={LABELS.proofFileHint}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.remarksLabel}
          htmlFor={`payout-remarks-${payoutId}`}
        >
          <Textarea
            id={`payout-remarks-${payoutId}`}
            value={remarks}
            maxLength={2000}
            onChange={handleRemarksChange}
          />
        </FormFieldFrame>
        {errorMessage}
      </StatusDialog>
    </>
  );
}

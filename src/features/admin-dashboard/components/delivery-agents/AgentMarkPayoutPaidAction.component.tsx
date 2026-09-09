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
import { FilePicker } from "@/shared/components/FilePicker.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { AgentPaymentMethodsList } from "./AgentMarkPayoutPaidAction/AgentPaymentMethodsList.component";
import {
  AGENT_PAYMENT_METHODS,
  useAgentMarkPayoutPaidAction,
} from "../../hooks/delivery-agents/useAgentMarkPayoutPaidAction.hook";
import { agentMarkPayoutPaidActionStyles as styles } from "../../styles/delivery-agents/agentMarkPayoutPaidAction.styles";

interface AgentMarkPayoutPaidActionProps {
  payoutId: string;
  onDone: () => void;
}

export function AgentMarkPayoutPaidAction({
  payoutId,
  onDone,
}: AgentMarkPayoutPaidActionProps) {
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
  } = useAgentMarkPayoutPaidAction({ payoutId, onDone });

  const errorMessage = error ? (
    <p className={styles.errorMessage}>{error}</p>
  ) : null;

  return (
    <>
      <Button size="sm" variant="outline" onClick={openDialog}>
        <CheckCircle2 className={styles.icon} aria-hidden="true" />
        Mark paid
      </Button>
      <StatusDialog
        open={open}
        onOpenChange={handleOpenChange}
        variant="success"
        title="Mark agent payout as paid"
        description="Record the transfer to the delivery agent's account. This action cannot be reversed here."
        secondaryAction={{ label: "Cancel", onClick: close, disabled: pending }}
        primaryAction={{
          label: "Mark paid",
          onClick: submit,
          loading: pending,
          disabled: !reference.trim(),
          disabledHint: "Enter a payment reference number.",
        }}
      >
        <FormFieldFrame
          label="Payment method"
          htmlFor={`agent-payout-method-${payoutId}`}
          required
        >
          <Select value={method} onValueChange={handleMethodChange}>
            <SelectTrigger id={`agent-payout-method-${payoutId}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <AgentPaymentMethodsList methods={AGENT_PAYMENT_METHODS} />
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame
          label="Payment reference number"
          htmlFor={`agent-payout-reference-${payoutId}`}
          required
        >
          <Input
            id={`agent-payout-reference-${payoutId}`}
            value={reference}
            maxLength={120}
            placeholder="UTR, transaction ID, or cheque number"
            onChange={handleReferenceChange}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label="Paid at (optional)"
          htmlFor={`agent-payout-date-${payoutId}`}
        >
          <Input
            id={`agent-payout-date-${payoutId}`}
            type="datetime-local"
            value={paidAt}
            onChange={handlePaidAtChange}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label="Proof of payment (optional)"
          htmlFor={`agent-payout-proof-${payoutId}`}
        >
          <FilePicker
            id={`agent-payout-proof-${payoutId}`}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            maxBytes={5 * 1024 * 1024}
            value={proof}
            onChange={setProof}
            disabled={pending}
            hint="PNG, JPEG, WebP, or PDF • Max 5 MB"
          />
        </FormFieldFrame>
        <FormFieldFrame
          label="Remarks (optional)"
          htmlFor={`agent-payout-remarks-${payoutId}`}
        >
          <Textarea
            id={`agent-payout-remarks-${payoutId}`}
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

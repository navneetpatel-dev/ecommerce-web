"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Gift, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import { useGiftCardPurchase } from "@/features/giftCards";

interface IssueGiftCardDialogProps {
  onSuccess?: () => void;
}

export function IssueGiftCardDialog({ onSuccess }: IssueGiftCardDialogProps) {
  const [open, setOpen] = useState(false);
  const { purchase, isBusy, error, reset } = useGiftCardPurchase();
  const [amount, setAmount] = useState<number | undefined>(500);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  const handleAmountChange = (val: number | undefined) => setAmount(val);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRecipientEmail(e.target.value);
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRecipientName(e.target.value);
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(e.target.value);

  const canSubmit = Boolean(amount && amount >= 50 && recipientEmail.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !recipientEmail) return;

    await purchase({
      amount,
      recipientEmail: recipientEmail.trim(),
      recipientName: recipientName.trim() || undefined,
      message: message.trim() || undefined,
    });
    setOpen(false);
    reset();
    onSuccess?.();
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" aria-hidden />
          <span>{LABELS.issueGiftCard}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="size-5 text-brand" aria-hidden />
              <span>{LABELS.issueGiftCardTitle}</span>
            </DialogTitle>
            <DialogDescription>
              {LABELS.issueGiftCardDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormFieldFrame
              label={LABELS.giftCardAmount}
              htmlFor="gift-card-issue-amount"
            >
              <NumberInput
                id="gift-card-issue-amount"
                value={amount}
                min={50}
                max={50000}
                step={50}
                prefix={CURRENCY_SYMBOL}
                onChange={handleAmountChange}
              />
            </FormFieldFrame>

            <FormFieldFrame
              label={LABELS.giftCardRecipientEmail}
              htmlFor="gift-card-issue-email"
            >
              <Input
                id="gift-card-issue-email"
                type="email"
                required
                value={recipientEmail}
                onChange={handleEmailChange}
                placeholder="recipient@example.com"
              />
            </FormFieldFrame>

            <FormFieldFrame
              label={LABELS.giftCardRecipientName}
              htmlFor="gift-card-issue-name"
            >
              <Input
                id="gift-card-issue-name"
                value={recipientName}
                onChange={handleNameChange}
              />
            </FormFieldFrame>

            <FormFieldFrame
              label={LABELS.giftCardMessage}
              htmlFor="gift-card-issue-message"
            >
              <Textarea
                id="gift-card-issue-message"
                rows={3}
                value={message}
                onChange={handleMessageChange}
              />
            </FormFieldFrame>

            {error ? (
              <p
                role="alert"
                className="text-body-xs font-medium text-destructive"
              >
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              {LABELS.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={isBusy}
              disabled={!canSubmit || isBusy}
            >
              {LABELS.issueGiftCard}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

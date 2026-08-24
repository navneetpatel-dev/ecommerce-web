"use client";

import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

type Props = {
  canSubmit: boolean;
  disableHint: string;
  isPending: boolean;
};

export function FormHeader({ canSubmit, disableHint, isPending }: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-1.5">
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {LABELS.newSupportTicket}
        </h1>
        <p className="max-w-3xl text-body leading-relaxed text-ink-muted">
          {LABELS.newSupportTicketDescription}
        </p>
      </div>
      <DisabledActionHint disabled={!canSubmit} message={disableHint}>
        <Button
          type="submit"
          className="hidden shrink-0 sm:inline-flex"
          loading={isPending}
          disabled={!canSubmit || isPending}
        >
          {LABELS.ticketSubmit}
        </Button>
      </DisabledActionHint>
    </div>
  );
}

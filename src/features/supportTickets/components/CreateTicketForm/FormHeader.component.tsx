"use client";

import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

import { createTicketFormStyles } from "./createTicketForm.styles";

type Props = {
  canSubmit: boolean;
  disableHint: string;
  isPending: boolean;
};

export function FormHeader({ canSubmit, disableHint, isPending }: Props) {
  return (
    <div className={createTicketFormStyles.header}>
      <div className={createTicketFormStyles.headerTitleWrap}>
        <h1 className={createTicketFormStyles.headerTitle}>
          {LABELS.newSupportTicket}
        </h1>
        <p className={createTicketFormStyles.headerDesc}>
          {LABELS.newSupportTicketDescription}
        </p>
      </div>
      <DisabledActionHint disabled={!canSubmit} message={disableHint}>
        <Button
          type="submit"
          className={createTicketFormStyles.headerSubmitBtn}
          loading={isPending}
          disabled={!canSubmit || isPending}
        >
          {LABELS.ticketSubmit}
        </Button>
      </DisabledActionHint>
    </div>
  );
}

"use client";

import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { CreateTicketForm } from "../components/CreateTicketForm.component";
import { SupportAuthGate } from "../components/SupportAuthGate.component";
import { supportTicketsPagesStyles } from "./supportTicketsPages.styles";

export function CustomerNewTicketPage() {
  return (
    <SupportAuthGate
      message={LABELS.ticketSignInRequired}
      loginNext={PATHS.supportTicketNew}
    >
      <div className={supportTicketsPagesStyles.customerNewTicketContainer}>
        <CreateTicketForm successHref={PATHS.supportTicket} />
      </div>
    </SupportAuthGate>
  );
}

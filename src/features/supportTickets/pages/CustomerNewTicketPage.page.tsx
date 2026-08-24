"use client";

import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { CreateTicketForm } from "../components/CreateTicketForm.component";
import { SupportAuthGate } from "../components/SupportAuthGate.component";

export function CustomerNewTicketPage() {
  return (
    <SupportAuthGate
      message={LABELS.ticketSignInRequired}
      loginNext={PATHS.supportTicketNew}
    >
      <div className="storefront-container py-8 md:py-10">
        <CreateTicketForm successHref={PATHS.supportTicket} />
      </div>
    </SupportAuthGate>
  );
}

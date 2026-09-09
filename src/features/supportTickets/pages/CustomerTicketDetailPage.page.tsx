"use client";

import { useParams } from "next/navigation";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { PATHS } from "@/shared/constants/paths";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useSupportTicket } from "../api/supportTickets.queries";
import { SupportAuthGate } from "../components/SupportAuthGate.component";
import { TicketThread } from "../components/TicketThread.component";
import { supportTicketsPagesStyles } from "./supportTicketsPages.styles";

export function CustomerTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  return (
    <SupportAuthGate
      message={LABELS.ticketSignInRequired}
      loginNext={PATHS.supportTicket(id)}
    >
      <CustomerTicketDetailContent id={id} />
    </SupportAuthGate>
  );
}

function CustomerTicketDetailContent({ id }: { id: string }) {
  const query = useSupportTicket(id);
  const { data, isLoading, isEmpty, error } = resolveQueryDetailState(query, {
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <DetailQuerySkeleton />;
  }

  if (isEmpty) {
    return (
      <div className={supportTicketsPagesStyles.customerDetailErrorContainer}>
        <div className={supportTicketsPagesStyles.errorBox}>
          <QueryErrorAlert
            error={error}
            fallback={LABELS.ticketCouldNotLoadDetail}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={supportTicketsPagesStyles.customerDetailRoot}>
      <div
        aria-hidden
        className={supportTicketsPagesStyles.customerDetailGlow}
      />
      <div className={supportTicketsPagesStyles.customerDetailContainer}>
        <TicketThread ticket={data!} mode="customer" />
      </div>
    </div>
  );
}

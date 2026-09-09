"use client";

import { useParams } from "next/navigation";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useSupportTicket } from "../../api/list/supportTickets.queries";
import { TicketThread } from "../../components/detail/TicketThread.component";
import { supportTicketsPagesStyles } from "../customer/supportTicketsPages.styles";

export function AdminTicketDetailPage() {
  return (
    <RequirePermission permission={PERMISSIONS.TICKET_MANAGE}>
      <AdminTicketDetailContent />
    </RequirePermission>
  );
}

function AdminTicketDetailContent() {
  const params = useParams<{ id: string }>();
  const ticketId = params.id;
  const query = useSupportTicket(ticketId);
  const { data, isLoading, isEmpty, error } = resolveQueryDetailState(query, {
    enabled: Boolean(ticketId),
  });

  if (isLoading)
    return (
      <DetailQuerySkeleton
        className={supportTicketsPagesStyles.detailSkeletonMargin}
      />
    );
  if (isEmpty) {
    return (
      <div className={supportTicketsPagesStyles.errorBox}>
        <QueryErrorAlert
          error={error}
          fallback={LABELS.ticketCouldNotLoadDetail}
        />
      </div>
    );
  }

  return <TicketThread ticket={data!} mode="admin" />;
}

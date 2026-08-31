"use client";

import { useParams } from "next/navigation";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import { useSupportTicket } from "../api/supportTickets.queries";
import { TicketThread } from "../components/TicketThread.component";

export function VendorTicketDetailPage() {
  return (
    <RequirePermission permission={VENDOR_SUPPORT_ACCESS}>
      <VendorTicketDetailContent />
    </RequirePermission>
  );
}

function VendorTicketDetailContent() {
  const params = useParams<{ id: string }>();
  const ticketId = params.id;
  const query = useSupportTicket(ticketId);
  const { data, isLoading, isEmpty, error } = resolveQueryDetailState(query, {
    enabled: Boolean(ticketId),
  });

  if (isLoading) return <DetailQuerySkeleton className="space-y-3 py-4" />;
  if (isEmpty) {
    return (
      <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
        {(error as Error | null)?.message || LABELS.ticketCouldNotLoadDetail}
      </p>
    );
  }

  return <TicketThread ticket={data!} mode="vendor" />;
}

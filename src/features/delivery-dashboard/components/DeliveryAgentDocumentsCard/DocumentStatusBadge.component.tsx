import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { DeliveryAgentDocument } from "../../types";

export function DocumentStatusBadge({
  document,
}: {
  document?: DeliveryAgentDocument;
}) {
  if (!document) {
    return <span className="text-body-sm text-ink-muted">Not submitted</span>;
  }
  if (document.verified) {
    return (
      <span className="flex items-center gap-1 text-body-sm text-success">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        Approved
      </span>
    );
  }
  if (document.rejectedAt) {
    return (
      <span className="flex items-center gap-1 text-body-sm text-danger">
        <XCircle className="size-3.5" aria-hidden="true" />
        Rejected
        {document.rejectionReason ? `: ${document.rejectionReason}` : ""}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-body-sm text-warning">
      <Clock className="size-3.5" aria-hidden="true" />
      Pending review
    </span>
  );
}

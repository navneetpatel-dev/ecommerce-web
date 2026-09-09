import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { DeliveryAgentDocument } from "../../types";
import { deliveryAgentDocumentsCardStyles as styles } from "./deliveryAgentDocumentsCard.styles";

export function DocumentStatusBadge({
  document,
}: {
  document?: DeliveryAgentDocument;
}) {
  if (!document) {
    return <span className={styles.badgeNotSubmitted}>Not submitted</span>;
  }
  if (document.verified) {
    return (
      <span className={styles.badgeApproved}>
        <CheckCircle2 className={styles.badgeIcon} aria-hidden="true" />
        Approved
      </span>
    );
  }
  if (document.rejectedAt) {
    return (
      <span className={styles.badgeRejected}>
        <XCircle className={styles.badgeIcon} aria-hidden="true" />
        Rejected
        {document.rejectionReason ? `: ${document.rejectionReason}` : ""}
      </span>
    );
  }
  return (
    <span className={styles.badgePending}>
      <Clock className={styles.badgeIcon} aria-hidden="true" />
      Pending review
    </span>
  );
}

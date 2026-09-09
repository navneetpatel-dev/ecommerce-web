import { daysUntil } from "../../../utils/documents/deliveryDocumentStatus";
import { deliveryAgentDocumentsCardStyles as styles } from "../../../styles/documents/deliveryAgentDocumentsCard.styles";

export function ExpiryBadge({ expiryDate }: { expiryDate: string | null }) {
  if (!expiryDate) return null;
  const daysLeft = daysUntil(expiryDate);
  if (daysLeft < 0) {
    return <span className={styles.badgeExpired}>Expired {expiryDate}</span>;
  }
  if (daysLeft <= 7) {
    return (
      <span className={styles.badgeExpiringSoon}>
        Expires in {daysLeft} day{daysLeft === 1 ? "" : "s"} ({expiryDate})
      </span>
    );
  }
  return (
    <span className={styles.badgeExpiresNormal}>Expires {expiryDate}</span>
  );
}

import { daysUntil } from "../../utils/deliveryDocumentStatus";

export function ExpiryBadge({ expiryDate }: { expiryDate: string | null }) {
  if (!expiryDate) return null;
  const daysLeft = daysUntil(expiryDate);
  if (daysLeft < 0) {
    return (
      <span className="text-body-sm text-danger">Expired {expiryDate}</span>
    );
  }
  if (daysLeft <= 7) {
    return (
      <span className="text-body-sm text-warning">
        Expires in {daysLeft} day{daysLeft === 1 ? "" : "s"} ({expiryDate})
      </span>
    );
  }
  return (
    <span className="text-body-sm text-ink-muted">Expires {expiryDate}</span>
  );
}

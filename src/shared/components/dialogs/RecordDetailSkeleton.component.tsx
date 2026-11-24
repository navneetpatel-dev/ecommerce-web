import { recordDetailDialogStyles } from "../../styles/dialogs/dialogComponents.styles";

export function RecordDetailSkeleton() {
  return (
    <div
      className={recordDetailDialogStyles.list}
      data-testid="record-detail-skeleton"
    >
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className={recordDetailDialogStyles.fieldRow}>
          <div className="h-4 w-28 bg-muted animate-pulse rounded" />
          <div className="h-4 w-44 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

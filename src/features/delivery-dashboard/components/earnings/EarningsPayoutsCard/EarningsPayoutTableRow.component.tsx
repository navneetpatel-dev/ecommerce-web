import { useCallback } from "react";
import { Download } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { earningsPayoutsCardStyles } from "./earningsPayoutsCard.styles";
import type { PayoutTableRowViewModel } from "./useEarningsPayoutsCardPresentation.hook";

interface EarningsPayoutTableRowProps {
  row: PayoutTableRowViewModel;
  isDownloading: boolean;
  onDownload: (id: string) => Promise<void>;
}

export function EarningsPayoutTableRow({
  row,
  isDownloading,
  onDownload,
}: EarningsPayoutTableRowProps) {
  const handleClick = useCallback(() => {
    void onDownload(row.id);
  }, [onDownload, row.id]);

  return (
    <tr className={earningsPayoutsCardStyles.tr}>
      <td className={earningsPayoutsCardStyles.tdText}>{row.periodLabel}</td>
      <td className={earningsPayoutsCardStyles.tdMono}>{row.amountLabel}</td>
      <td className={earningsPayoutsCardStyles.tdStatus}>
        <StatusBadge status={row.status} />
      </td>
      <td className={earningsPayoutsCardStyles.tdText}>{row.referenceLabel}</td>
      <td className={earningsPayoutsCardStyles.tdStatus}>
        <button
          type="button"
          className={earningsPayoutsCardStyles.downloadButton}
          disabled={isDownloading}
          onClick={handleClick}
        >
          <Download
            className={earningsPayoutsCardStyles.downloadIcon}
            aria-hidden="true"
          />
          PDF
        </button>
      </td>
    </tr>
  );
}

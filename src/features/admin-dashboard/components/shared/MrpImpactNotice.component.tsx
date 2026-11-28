import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { MrpImpact } from "../../api/tax/tax.api";
import { categoryRateImpactStyles as styles } from "../../styles/categories/categoryRateImpact.styles";

/** Warns that a change stops options selling because their price with GST passes the MRP. */
export function MrpImpactNotice({ impact }: { impact?: MrpImpact | null }) {
  if (!impact || impact.variantCount === 0) return null;
  return (
    <span role="status" className={styles.warning}>
      {formatLabel(LABELS.aboveMrpImpact, {
        variants: impact.variantCount,
        products: impact.productCount,
        vendors: impact.vendorCount,
      })}
    </span>
  );
}

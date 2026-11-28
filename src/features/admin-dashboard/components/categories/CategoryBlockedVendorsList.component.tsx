import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { CategoryRates } from "../../hooks/categories/useCategoryRateImpact.hook";
import { categoryRateImpactStyles as styles } from "../../styles/categories/categoryRateImpact.styles";

/** The vendors whose missing documents stop a reassignment, and how many products each has. */
export function CategoryBlockedVendorsList({
  vendors,
}: {
  vendors: CategoryRates["blockedVendors"];
}) {
  if (vendors.length === 0) return null;
  return (
    <div>
      <p className={styles.blocked}>{LABELS.categoryReassignBlocked}</p>
      <ul className={styles.list}>
        {vendors.map((vendor) => (
          <li key={vendor.vendorId}>
            {formatLabel(LABELS.categoryReassignBlockedVendor, {
              vendor: vendor.businessName,
              count: vendor.products,
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { PATHS } from "@/shared/constants/paths/paths";
import { ordersActivitySectionStyles as styles } from "./ordersActivitySection.styles";

export function RecentOrdersEmptyState() {
  return (
    <p className={styles.emptyText}>
      No orders yet.{" "}
      <Link href={PATHS.products} className={styles.emptyLink}>
        Start shopping
      </Link>
    </p>
  );
}

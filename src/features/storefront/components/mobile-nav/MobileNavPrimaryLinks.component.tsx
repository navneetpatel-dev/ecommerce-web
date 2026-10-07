import Link from "next/link";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { mobileNavDrawerStyles as styles } from "../../styles/mobile-nav/mobileNavDrawer.styles";

const PRIMARY_LINKS = [
  { href: PATHS.products, label: LABELS.allProducts },
  { href: PATHS.productsNewest, label: LABELS.newArrivals },
  { href: PATHS.categories, label: LABELS.categories },
  { href: PATHS.vendors, label: LABELS.vendors },
  { href: PATHS.orderTracking, label: LABELS.trackOrder },
] as const;

interface MobileNavPrimaryLinksProps {
  onNavigate: () => void;
}

/** Top-level drawer links, rendered as one link per PRIMARY_LINKS entry. */
export function MobileNavPrimaryLinks({
  onNavigate,
}: MobileNavPrimaryLinksProps) {
  return (
    <>
      {PRIMARY_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={styles.navLink}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

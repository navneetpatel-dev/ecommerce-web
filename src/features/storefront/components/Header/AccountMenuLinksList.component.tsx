import Link from "next/link";
import { headerStyles as styles } from "../../styles/header/header.styles";

interface AccountLinkItem {
  href: string;
  label: string;
}

interface AccountMenuLinksListProps {
  links: readonly AccountLinkItem[];
  onNavigate: () => void;
}

/** Panel links for the account dropdown — one Link per account section. */
export function AccountMenuLinksList({
  links,
  onNavigate,
}: AccountMenuLinksListProps) {
  return (
    <div className={styles.linksList}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={styles.menuItem}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

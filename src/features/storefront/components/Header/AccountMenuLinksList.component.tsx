import Link from "next/link";
import type { AccountMenuLink } from "../../constants/header/accountMenuGroups";
import { headerStyles as styles } from "../../styles/header/header.styles";

interface AccountMenuLinksListProps {
  links: readonly AccountMenuLink[];
  onNavigate: () => void;
}

/** One group's links in the account dropdown. */
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

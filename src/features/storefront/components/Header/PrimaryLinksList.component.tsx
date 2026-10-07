import Link from "next/link";
import { cn } from "@/shared/utils/dom/cn";
import { headerStyles as styles } from "../../styles/header/header.styles";

interface PrimaryLinksListProps {
  primaryLinks: readonly { href: string; label: string }[];
}

/** Secondary nav links beside the categories trigger — one Link per entry. */
export function PrimaryLinksList({ primaryLinks }: PrimaryLinksListProps) {
  return (
    <>
      {primaryLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(styles.primaryLink, styles.primaryLinkSolid)}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

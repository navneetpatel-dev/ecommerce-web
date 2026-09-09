import Link from "next/link";
import { FOOTER_LINK } from "../../../styles/layout/footer.styles";

export interface FooterLinkItem {
  href: string;
  label: string;
}

interface FooterLinksListProps {
  links: readonly FooterLinkItem[];
  className?: string;
}

export function FooterLinksList({ links, className }: FooterLinksListProps) {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={FOOTER_LINK}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

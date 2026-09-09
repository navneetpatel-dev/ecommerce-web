import { Button } from "@/shared/components/ui/button";
import type { AccountNavItem, AccountSectionId } from "../../types/layout/types";
import { accountLayoutStyles as styles } from "../../styles/layout/accountLayout.styles";

interface AccountMobileNavProps {
  sections: AccountNavItem[];
  activeSection: AccountSectionId;
  onSectionChange: (id: AccountSectionId) => void;
}

export function AccountMobileNav({
  sections,
  activeSection,
  onSectionChange,
}: AccountMobileNavProps) {
  return (
    <nav aria-label="Account sections" className={styles.mobileNavContainer}>
      <ul className={styles.mobileNavList}>
        {sections.map((section) => {
          const selected = section.id === activeSection;
          const Icon = section.icon;
          const handleSectionClick = () => {
            onSectionChange(section.id);
          };

          return (
            <li key={section.id}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSectionClick}
                aria-current={selected ? "page" : undefined}
                className={styles.mobileNavButton(selected)}
              >
                <Icon size={15} strokeWidth={1.5} aria-hidden />
                {section.label}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import { Button } from "@/shared/components/ui/button";
import type { AccountNavItem, AccountSectionId } from "../../types/layout/types";
import { accountLayoutStyles as styles } from "./accountLayout.styles";

interface AccountDesktopNavProps {
  sections: AccountNavItem[];
  activeSection: AccountSectionId;
  onSectionChange: (id: AccountSectionId) => void;
}

export function AccountDesktopNav({
  sections,
  activeSection,
  onSectionChange,
}: AccountDesktopNavProps) {
  return (
    <aside className={styles.desktopAside}>
      <nav aria-label="Account sections" className={styles.desktopNav}>
        <ul className={styles.desktopNavList}>
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
                  variant="ghost"
                  onClick={handleSectionClick}
                  aria-current={selected ? "page" : undefined}
                  className={styles.desktopNavButton(selected)}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className={styles.desktopNavIcon(selected)}
                    aria-hidden
                  />
                  <span className={styles.mainColumn}>
                    <span className={styles.desktopNavLabel(selected)}>
                      {section.label}
                    </span>
                    <span className={styles.desktopNavDescription}>
                      {section.description}
                    </span>
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

"use client";

import { useId, type FocusEvent, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { Button } from "@/shared/components/ui/button";
import { SearchBarContainer } from "@/features/search";
import { CategoriesMegaMenu } from "@/features/categories";
import { LABELS } from "@/shared/constants/labels";
import { PrimaryLinksList } from "./PrimaryLinksList.component";
import type { Category } from "@/shared/api/types";
import { headerStyles as styles } from "../../styles/header/header.styles";

interface DesktopPrimaryNavProps {
  categories: Category[];
  primaryLinks: readonly { href: string; label: string }[];
  megaMenuOpen: boolean;
  onToggleMegaMenu: () => void;
  onCloseMegaMenu: () => void;
  onScheduleMegaOpen: () => void;
  onScheduleMegaClose: () => void;
}

export function DesktopPrimaryNav({
  categories,
  primaryLinks,
  megaMenuOpen,
  onToggleMegaMenu,
  onCloseMegaMenu,
  onScheduleMegaOpen,
  onScheduleMegaClose,
}: DesktopPrimaryNavProps) {
  const megaMenuId = useId();

  // Hover intent cannot dismiss the panel for keyboard users: Escape closes it,
  // and focus leaving the wrapper (Tab past the panel) closes it too.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !megaMenuOpen) return;
    event.stopPropagation();
    onCloseMegaMenu();
  };
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!megaMenuOpen) return;
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    onCloseMegaMenu();
  };

  return (
    <>
      <nav aria-label="Primary navigation" className={styles.desktopNav}>
        <div
          className={styles.relativeWrapper}
          /* Pointer-intent zone for the mega menu (open/close delays handle
             mouse transit); the trigger and links inside are the real
             controls, so the wrapper is presentational. */
          role="presentation"
          onMouseEnter={onScheduleMegaOpen}
          onMouseLeave={onScheduleMegaClose}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={styles.categoriesButtonBase}
            aria-expanded={megaMenuOpen}
            aria-controls={megaMenuOpen ? megaMenuId : undefined}
            aria-label={LABELS.browseCategories}
            onClick={onToggleMegaMenu}
          >
            {LABELS.categories}{" "}
            <ChevronDown
              size={16}
              className={cn(
                styles.categoriesChevron,
                megaMenuOpen && styles.categoriesChevronOpen,
              )}
            />
          </Button>

          {megaMenuOpen && (
            <CategoriesMegaMenu
              id={megaMenuId}
              categories={categories}
              onClose={onCloseMegaMenu}
              onMouseEnter={onScheduleMegaOpen}
              onMouseLeave={onScheduleMegaClose}
            />
          )}
        </div>

        <PrimaryLinksList primaryLinks={primaryLinks} />
      </nav>

      <div className={styles.searchWrapper}>
        <SearchBarContainer panelLayout="dropdown" />
      </div>
    </>
  );
}

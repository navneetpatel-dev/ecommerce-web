"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { Button } from "@/shared/components/ui/button";
import { SearchBarContainer } from "@/features/search";
import { CategoriesMegaMenu } from "@/features/categories";
import { LABELS } from "@/shared/constants/labels";
import type { Category } from "@/shared/api/types";
import { headerStyles as styles } from "../../styles/header/header.styles";

interface DesktopPrimaryNavProps {
  categories: Category[];
  primaryLinks: readonly { href: string; label: string }[];
  megaMenuOpen: boolean;
  isTransparent: boolean;
  onToggleMegaMenu: () => void;
  onCloseMegaMenu: () => void;
  onScheduleMegaOpen: () => void;
  onScheduleMegaClose: () => void;
}

export function DesktopPrimaryNav({
  categories,
  primaryLinks,
  megaMenuOpen,
  isTransparent,
  onToggleMegaMenu,
  onCloseMegaMenu,
  onScheduleMegaOpen,
  onScheduleMegaClose,
}: DesktopPrimaryNavProps) {
  return (
    <>
      <nav aria-label="Primary navigation" className={styles.desktopNav}>
        <div
          className={styles.relativeWrapper}
          onMouseEnter={onScheduleMegaOpen}
          onMouseLeave={onScheduleMegaClose}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              styles.categoriesButtonBase,
              isTransparent ? styles.categoriesButtonTransparent : undefined,
            )}
            aria-expanded={megaMenuOpen}
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
              categories={categories}
              onClose={onCloseMegaMenu}
              onMouseEnter={onScheduleMegaOpen}
              onMouseLeave={onScheduleMegaClose}
            />
          )}
        </div>

        {primaryLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              styles.primaryLink,
              isTransparent
                ? styles.primaryLinkTransparent
                : styles.primaryLinkSolid,
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.searchWrapper}>
        <SearchBarContainer onDark={isTransparent} panelLayout="dropdown" />
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import { SearchBarContainer } from "@/features/search";
import { CategoriesMegaMenu } from "@/features/categories";
import { LABELS } from "@/shared/constants/labels";
import type { Category } from "@/shared/api/types";

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
      <nav
        aria-label="Primary navigation"
        className="hidden xl:flex items-center gap-1"
      >
        <div
          className="relative"
          onMouseEnter={onScheduleMegaOpen}
          onMouseLeave={onScheduleMegaClose}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1",
              isTransparent
                ? "text-paper hover:bg-paper/10 hover:text-paper"
                : undefined,
            )}
            aria-expanded={megaMenuOpen}
            aria-label={LABELS.browseCategories}
            onClick={onToggleMegaMenu}
          >
            {LABELS.categories}{" "}
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform",
                megaMenuOpen && "rotate-180",
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
              "px-3 py-2 rounded-md text-[0.8125rem] font-medium transition-colors",
              isTransparent
                ? "text-paper hover:bg-paper/10"
                : "text-ink hover:bg-paper",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden xl:flex flex-1 max-w-xl mx-auto">
        <SearchBarContainer onDark={isTransparent} panelLayout="dropdown" />
      </div>
    </>
  );
}

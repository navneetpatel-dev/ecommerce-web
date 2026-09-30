"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { cn } from "@/shared/utils/dom/cn";
import type { Category } from "@/shared/api/types";
import { useMobileNavCategories } from "../../hooks/mobile-nav/useMobileNavCategories.hook";
import { MobileNavCategoryTile } from "./MobileNavCategoryTile.component";
import { mobileNavDrawerStyles as styles } from "../../styles/mobile-nav/mobileNavDrawer.styles";

interface MobileNavCategoryTreeProps {
  categories: Category[];
  onNavigate: () => void;
}

/**
 * Drawer categories as dropdowns, in the navbar's tile language (Rule 5: one look per
 * concept).
 *
 * The drawer opens with a tidy "Categories" row; tapping it drops the department tiles down,
 * and tapping a tile drops that department's subcategory pills down — the same tile the mega
 * menu renders, disclosed instead of always-open, because a 288px column has no room for a
 * long list.
 */
export function MobileNavCategoryTree({
  categories,
  onNavigate,
}: MobileNavCategoryTreeProps) {
  const {
    open,
    toggleCategories,
    expandedId,
    toggleDepartment,
    departments,
    count,
    listId,
    panelId,
  } = useMobileNavCategories(categories);

  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeaderRow}>
        <button
          type="button"
          onClick={toggleCategories}
          aria-expanded={open}
          aria-controls={listId}
          className={styles.categoryToggle}
        >
          <span className={styles.categoryToggleText}>
            <span className={styles.categoryHeaderTitle}>
              {LABELS.categories}
            </span>
            {count > 0 ? (
              <>
                <span className={styles.categoryCountPill} aria-hidden>
                  {count}
                </span>
                <span className={styles.categoryCountSrText}>
                  {formatLabel(LABELS.categoryCountLabel, { count })}
                </span>
              </>
            ) : null}
          </span>
          <ChevronDown
            className={cn(
              styles.categoryChevron,
              open && styles.categoryChevronOpen,
            )}
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
        {count > 0 ? (
          <Link
            href={PATHS.categories}
            onClick={onNavigate}
            className={styles.viewAllLink}
          >
            {LABELS.viewAll}{" "}
            <ArrowRight className={styles.arrowIcon} aria-hidden />
          </Link>
        ) : null}
      </div>

      {count === 0 ? (
        <p className={styles.categoryEmptyText}>{LABELS.noCategoriesYet}</p>
      ) : null}

      {open && count > 0 ? (
        <ul id={listId} className={styles.categoryList}>
          {departments.map((department) => (
            <MobileNavCategoryTile
              key={department.department.id}
              dropdown={department}
              tree={categories}
              expanded={expandedId === department.department.id}
              panelId={panelId(department.department.id)}
              onToggle={() => toggleDepartment(department.department.id)}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Category } from "@/shared/api/types";
import { CategoryMegaMenuTile } from "./CategoryMegaMenuTile.component";
import { categoryMegaMenuStyles as styles } from "../../../styles/mega-menu/categoryMegaMenu.styles";

interface CategoriesMegaMenuProps {
  categories: Category[];
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * ACTIVE taxonomy mega menu — up to 3 levels (Department → Category → Subcategory).
 */
export function CategoriesMegaMenu({
  categories,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: CategoriesMegaMenuProps) {
  const count = categories.length;

  return (
    <div
      className={styles.menuContainer}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.header}>
        <div>
          <p className={styles.headerTitle}>{LABELS.allCategories}</p>
          <p className={styles.headerSubtitle}>
            {count === 0
              ? LABELS.categoryPlpEmpty
              : formatLabel(LABELS.categoryDepartmentCount, { count })}
          </p>
        </div>
        <Link
          href={PATHS.categories}
          onClick={onClose}
          className={styles.headerAllCategoriesLink}
        >
          {LABELS.allCategories}{" "}
          <ArrowRight className={styles.headerArrowIcon} />
        </Link>
      </div>

      <div className={styles.bodyGrid}>
        <div className={styles.scrollArea}>
          {count === 0 ? (
            <p className={styles.emptyText}>{LABELS.categoryPlpEmpty}</p>
          ) : (
            <ul className={styles.tilesGrid}>
              {categories.map((department) => (
                <CategoryMegaMenuTile
                  key={department.id}
                  department={department}
                  tree={categories}
                  onClose={onClose}
                />
              ))}
            </ul>
          )}
        </div>

        <aside className={styles.aside}>
          <div className={styles.asideContent}>
            <div>
              <span className={styles.sparklesBadge}>
                <Sparkles
                  className={styles.sparklesIcon}
                  strokeWidth={1.5}
                  aria-hidden
                />
              </span>
              <p className={styles.asideTitle}>{LABELS.featured}</p>
              <p className={styles.asideSubtitle}>
                {LABELS.categoryExploreCollection}
              </p>
            </div>
            <Link
              href={PATHS.productsNewest}
              onClick={onClose}
              className={styles.asideCta}
            >
              {LABELS.shopNewArrivals}
              <ArrowRight className={styles.asideArrowIcon} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

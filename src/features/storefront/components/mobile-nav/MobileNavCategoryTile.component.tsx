"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { cn } from "@/shared/utils/dom/cn";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import type { Category } from "@/shared/api/types";
import {
  resolveCategoryIcon,
  resolveCategoryImageUrl,
  categoryHref,
} from "@/features/categories";
import type { MobileNavDepartmentDropdown } from "../../hooks/mobile-nav/useMobileNavCategories.hook";
import { mobileNavDrawerStyles as styles } from "../../styles/mobile-nav/mobileNavDrawer.styles";

interface MobileNavCategoryTileProps {
  dropdown: MobileNavDepartmentDropdown;
  tree: Category[];
  expanded: boolean;
  panelId: string;
  onToggle: () => void;
  onNavigate: () => void;
}

/**
 * One drawer department: the mega menu's tile, disclosed instead of always-open. The header
 * is the toggle (icon square, name, subcategory count, chevron); the panel holds the child
 * pills and the link on to the department page, which is where the deeper level lives.
 */
export function MobileNavCategoryTile({
  dropdown,
  tree,
  expanded,
  panelId,
  onToggle,
  onNavigate,
}: MobileNavCategoryTileProps) {
  const { department, visibleChildren, hiddenCount, childCountLabel } =
    dropdown;
  const Icon = resolveCategoryIcon(department);
  const imageUrl = resolveCategoryImageUrl(department);
  const departmentHref = categoryHref(department, tree);

  return (
    <li>
      <div
        className={cn(styles.categoryTile, expanded && styles.categoryTileOpen)}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className={styles.categoryTileHeader}
        >
          <span className={styles.categoryIconWrapper}>
            {imageUrl ? (
              <MediaImage
                src={imageUrl}
                alt=""
                unavailableLabel={formatLabel(LABELS.categoryImageUnavailable, {
                  name: department.name,
                })}
                sizes="44px"
                imageClassName={styles.categoryCoverImage}
                className={styles.categoryCoverLayer}
              />
            ) : (
              <Icon
                className={styles.categoryIcon}
                strokeWidth={1.5}
                aria-hidden
              />
            )}
          </span>
          <span className={styles.categoryTextWrapper}>
            <span className={styles.categoryName}>{department.name}</span>
            {childCountLabel ? (
              <span className={styles.categoryChildCount}>
                {childCountLabel}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={cn(
              styles.categoryChevron,
              expanded && styles.categoryChevronOpen,
            )}
            strokeWidth={1.75}
            aria-hidden
          />
        </button>

        {expanded ? (
          <div id={panelId} className={styles.categoryPanel}>
            {visibleChildren.length ? (
              <ul className={styles.categoryPills}>
                {visibleChildren.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={categoryHref(child, tree)}
                      onClick={onNavigate}
                      className={styles.categoryPill}
                    >
                      <span className={styles.categoryPillName}>
                        {child.name}
                      </span>
                    </Link>
                  </li>
                ))}
                {hiddenCount > 0 ? (
                  <li>
                    <Link
                      href={departmentHref}
                      onClick={onNavigate}
                      className={styles.categoryMoreLink}
                    >
                      +{hiddenCount}
                    </Link>
                  </li>
                ) : null}
              </ul>
            ) : null}
            <Link
              href={departmentHref}
              onClick={onNavigate}
              className={styles.categoryDepartmentLink}
            >
              {formatLabel(LABELS.viewAllInCategory, { name: department.name })}
              <ArrowRight className={styles.arrowIcon} aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>
    </li>
  );
}

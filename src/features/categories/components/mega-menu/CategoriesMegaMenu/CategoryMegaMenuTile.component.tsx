"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { MediaImage } from "@/shared/components/MediaImage.component";
import {
  categoryHref,
  resolveCategoryIcon,
  resolveCategoryImageUrl,
} from "../../../utils/browse/categoryHelpers";
import type { Category } from "@/shared/api/types";
import { categoryMegaMenuStyles as styles } from "./categoryMegaMenu.styles";

const MAX_VISIBLE_CHILDREN = 5;

interface CategoryMegaMenuTileProps {
  department: Category;
  tree: Category[];
  onClose: () => void;
}

export function CategoryMegaMenuTile({
  department,
  tree,
  onClose,
}: CategoryMegaMenuTileProps) {
  const Icon = resolveCategoryIcon(department);
  const imageUrl = resolveCategoryImageUrl(department);
  const children = department.children ?? [];
  const visibleChildren = children.slice(0, MAX_VISIBLE_CHILDREN);
  const hiddenCount = Math.max(0, children.length - visibleChildren.length);

  return (
    <li className={styles.tileItem}>
      <div className={styles.tileCard}>
        <Link
          href={categoryHref(department, tree)}
          onClick={onClose}
          className={styles.tileHeaderLink}
        >
          <span className={styles.tileIconWrapper}>
            {imageUrl ? (
              <MediaImage
                src={imageUrl}
                alt=""
                unavailableLabel={formatLabel(LABELS.categoryImageUnavailable, {
                  name: department.name,
                })}
                sizes="44px"
                imageClassName={styles.tileCoverImage}
                className={styles.tileMediaImage}
              />
            ) : (
              <Icon className={styles.tileIcon} strokeWidth={1.5} aria-hidden />
            )}
          </span>
          <span className={styles.tileTextWrapper}>
            <span className={styles.tileTitleRow}>
              <span className={styles.tileName}>{department.name}</span>
              <ArrowUpRight
                className={styles.tileArrowIcon}
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
            {children.length ? (
              <span className={styles.tileChildCount}>
                {formatLabel(
                  children.length === 1
                    ? LABELS.categoryChildCountSingular
                    : LABELS.categoryChildCountPlural,
                  { count: children.length },
                )}
              </span>
            ) : null}
          </span>
        </Link>

        {visibleChildren.length ? (
          <ul className={styles.childrenList}>
            {visibleChildren.map((child) => (
              <li key={child.id}>
                <Link
                  href={categoryHref(child, tree)}
                  onClick={onClose}
                  className={styles.childPill}
                >
                  <span className={styles.childPillName}>{child.name}</span>
                </Link>
              </li>
            ))}
            {hiddenCount > 0 ? (
              <li>
                <Link
                  href={categoryHref(department, tree)}
                  onClick={onClose}
                  className={styles.moreChildrenLink}
                >
                  +{hiddenCount}
                </Link>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

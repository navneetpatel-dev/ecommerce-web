import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import type { Category } from "@/shared/api/types";
import { resolveCategoryIcon, categoryHref } from "@/features/categories";
import { mobileNavDrawerStyles as styles } from "./mobileNavDrawer.styles";

interface MobileNavCategoryTreeProps {
  categories: Category[];
  onNavigate: () => void;
}

/** Three-level (department → category → subcategory) mobile nav category tree. */
export function MobileNavCategoryTree({
  categories,
  onNavigate,
}: MobileNavCategoryTreeProps) {
  return (
    <>
      <div className={styles.categoryHeaderRow}>
        <span className={styles.categoryHeaderTitle}>{LABELS.categories}</span>
        {categories.length > 0 ? (
          <Link
            href={PATHS.categories}
            onClick={onNavigate}
            className={styles.viewAllLink}
          >
            {LABELS.viewAll} <ArrowRight className={styles.arrowIcon} />
          </Link>
        ) : null}
      </div>

      {categories.length === 0 ? (
        <p className={styles.emptyText}>{LABELS.noCategoriesYet}</p>
      ) : (
        <ul className={styles.departmentList}>
          {categories.map((department) => {
            const Icon = resolveCategoryIcon(department);
            return (
              <li key={department.id}>
                <Link
                  href={categoryHref(department, categories)}
                  onClick={onNavigate}
                  className={styles.departmentLink}
                >
                  <Icon className={styles.departmentIcon} strokeWidth={1.5} />
                  <span className={styles.truncateText}>{department.name}</span>
                </Link>
                {department.children?.length ? (
                  <ul className={styles.childrenList}>
                    {department.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={categoryHref(child, categories)}
                          onClick={onNavigate}
                          className={styles.childLink}
                        >
                          {child.name}
                        </Link>
                        {child.children?.length ? (
                          <ul className={styles.leafList}>
                            {child.children.map((leaf) => (
                              <li key={leaf.id}>
                                <Link
                                  href={categoryHref(leaf, categories)}
                                  onClick={onNavigate}
                                  className={styles.leafLink}
                                >
                                  {leaf.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

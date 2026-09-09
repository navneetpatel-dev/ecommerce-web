import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Category } from "@/shared/api/types";
import { categoryPlpPageStyles as styles } from "./categoryPlpPage.styles";

interface CategoryHeaderProps {
  category: Category;
  breadcrumbItems: Array<{ label: string; href: string }>;
  slugPath: string[];
}

export function CategoryHeader({
  category,
  breadcrumbItems,
  slugPath,
}: CategoryHeaderProps) {
  const childLinks = category.children ?? [];

  return (
    <header className={styles.header}>
      <Breadcrumbs items={breadcrumbItems} className={styles.breadcrumbs} />

      <div className={styles.titleRow}>
        <div className={styles.titleBlock}>
          <h1
            className={styles.title}
            style={{ fontSize: "var(--text-h1)", lineHeight: 1.15 }}
          >
            {category.name}
          </h1>
          {category.seoDescription ? (
            <p
              className={styles.seoDescription}
              style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.4 }}
            >
              {category.seoDescription}
            </p>
          ) : null}
        </div>

        {childLinks.length > 0 ? (
          <nav aria-label={LABELS.shopInCategory} className={styles.nav}>
            <p className={styles.navEyebrow}>{LABELS.shopInCategory}</p>
            <ul className={styles.navList}>
              {childLinks.map((child) => (
                <li key={child.id} className={styles.navItem}>
                  <Link
                    href={PATHS.category(...slugPath, child.slug)}
                    title={formatLabel(LABELS.shopCategory, {
                      name: child.name,
                    })}
                    aria-label={formatLabel(LABELS.shopCategory, {
                      name: child.name,
                    })}
                    className={styles.childLink}
                  >
                    <span>{child.name}</span>
                    <ChevronRight
                      className={styles.chevronIcon}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

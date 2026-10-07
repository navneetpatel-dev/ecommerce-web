import { CategoryCard, CategoryMoreCard } from "@/features/categories";
import { PATHS } from "@/shared/constants/paths/paths";
import type { Category } from "@/shared/api/types";
import { categoryRailStyles as styles } from "../../styles/category-rail/categoryRail.styles";

interface CategoryRailGridProps {
  visible: Category[];
  overflow: Category[];
  hasMore: boolean;
}

/** Renders one card per visible root category plus the overflow "more" card. */
export function CategoryRailGrid({
  visible,
  overflow,
  hasMore,
}: CategoryRailGridProps) {
  return (
    <div className={styles.grid}>
      {visible.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}

      {hasMore ? (
        <CategoryMoreCard
          href={PATHS.categories}
          moreCount={overflow.length}
          overflowCategories={overflow}
        />
      ) : null}
    </div>
  );
}

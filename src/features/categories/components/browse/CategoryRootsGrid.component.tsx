import type { Category } from "@/shared/api/types";
import { categoryHref } from "../../utils/browse/categoryHelpers";
import { CategoryCard } from "./CategoryCard.component";
import { categoriesViewStyles } from "../../styles/browse/categoriesView.styles";

interface CategoryRootsGridProps {
  roots: Category[];
  tree: Category[];
}

export function CategoryRootsGrid({ roots, tree }: CategoryRootsGridProps) {
  return (
    <div className={categoriesViewStyles.rootsGrid}>
      {roots.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          href={categoryHref(category, tree)}
        />
      ))}
    </div>
  );
}

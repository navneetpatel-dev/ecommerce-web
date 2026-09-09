import type { Category } from "@/shared/api/types";
import { categoriesViewStyles } from "../../styles/browse/categoriesView.styles";
import { CategorySubcategoryItem } from "./CategorySubcategoryItem.component";

interface CategorySubcategoriesListProps {
  items: Category[];
  tree: Category[];
}

export function CategorySubcategoriesList({
  items,
  tree,
}: CategorySubcategoriesListProps) {
  return (
    <ul className={categoriesViewStyles.childrenGrid}>
      {items.map((child) => (
        <CategorySubcategoryItem key={child.id} child={child} tree={tree} />
      ))}
    </ul>
  );
}

import Link from "next/link";
import type { Category } from "@/shared/api/types";
import type { CategoryRootWithChildren } from "../../hooks/browse/useCategoriesPage.hook";
import { categoryHref } from "../../utils/browse/categoryHelpers";
import { LABELS } from "@/shared/constants/labels";
import { categoriesViewStyles } from "./categoriesView.styles";
import { CategorySubcategoriesList } from "./CategorySubcategoriesList.component";

interface CategorySubcategoryGroupProps {
  group: CategoryRootWithChildren;
  tree: Category[];
}

export function CategorySubcategoryGroup({
  group,
  tree,
}: CategorySubcategoryGroupProps) {
  const { root, children } = group;

  return (
    <div>
      <div className={categoriesViewStyles.groupHeader}>
        <h3 className={categoriesViewStyles.groupTitle}>{root.name}</h3>
        <Link
          href={categoryHref(root, tree)}
          className={categoriesViewStyles.shopAllLink}
        >
          {LABELS.shopAll}
        </Link>
      </div>
      <CategorySubcategoriesList items={children} tree={tree} />
    </div>
  );
}

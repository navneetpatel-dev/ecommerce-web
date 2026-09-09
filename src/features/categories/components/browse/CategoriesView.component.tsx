"use client";

import { CategoriesPageSkeleton } from "@/shared/components/Skeletons.component";
import type { Category } from "@/shared/api/types";
import type { CategoryRootWithChildren } from "../../hooks/browse/useCategoriesPage.hook";
import { categoriesViewStyles } from "../../styles/browse/categoriesView.styles";
import { CategoriesViewHeader } from "./CategoriesViewHeader.component";
import { CategoriesEmptyState } from "./CategoriesEmptyState.component";
import { CategoryRootsGrid } from "./CategoryRootsGrid.component";
import { CategorySubcategoriesSection } from "./CategorySubcategoriesSection.component";

interface CategoriesViewProps {
  roots: Category[];
  rootsWithChildren: CategoryRootWithChildren[];
  tree: Category[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function CategoriesView({
  roots,
  rootsWithChildren,
  tree,
  isLoading,
  isEmpty,
}: CategoriesViewProps) {
  if (isLoading) return <CategoriesPageSkeleton />;

  return (
    <div className={categoriesViewStyles.container}>
      <CategoriesViewHeader />

      {isEmpty ? (
        <CategoriesEmptyState />
      ) : (
        <div className={categoriesViewStyles.contentWrapper}>
          <CategoryRootsGrid roots={roots} tree={tree} />
          <CategorySubcategoriesSection
            rootsWithChildren={rootsWithChildren}
            tree={tree}
          />
        </div>
      )}
    </div>
  );
}

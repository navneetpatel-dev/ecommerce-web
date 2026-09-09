"use client";

import { useCategoriesPage } from "../../hooks/browse/useCategoriesPage.hook";
import { CategoriesView } from "../../components/browse/CategoriesView.component";

export function CategoriesPage() {
  const page = useCategoriesPage();

  return (
    <CategoriesView
      roots={page.roots}
      rootsWithChildren={page.rootsWithChildren}
      tree={page.categories}
      isLoading={page.isLoading}
      isEmpty={page.isEmpty}
    />
  );
}

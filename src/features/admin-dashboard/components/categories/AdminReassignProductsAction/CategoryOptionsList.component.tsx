"use client";

import { SelectItem } from "@/shared/components/ui/select";
import type { Category } from "@/shared/api/types";

interface CategoryOptionsListProps {
  categories: Category[];
  loading?: boolean;
}

export function CategoryOptionsList({
  categories,
  loading = false,
}: CategoryOptionsListProps) {
  if (loading) {
    return (
      <SelectItem value="__loading__" disabled>
        Loading categories...
      </SelectItem>
    );
  }
  if (categories.length === 0) {
    return (
      <SelectItem value="__empty__" disabled>
        No categories available
      </SelectItem>
    );
  }
  return (
    <>
      {categories.map((category) => (
        <SelectItem key={category.id} value={category.id}>
          {category.name}
        </SelectItem>
      ))}
    </>
  );
}

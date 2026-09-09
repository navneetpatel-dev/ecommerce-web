"use client";

import { SelectItem } from "@/shared/components/ui/select";
import type { Category } from "@/shared/api/types";

interface CategoryOptionsListProps {
  categories: Category[];
}

export function CategoryOptionsList({ categories }: CategoryOptionsListProps) {
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

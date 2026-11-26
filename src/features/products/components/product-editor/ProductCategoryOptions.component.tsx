"use client";

import { SelectItem } from "@/shared/components/ui/select";
import type { CategoryOptionData } from "../../types/product-editor/types";
import { productEditorFormStyles as styles } from "../../styles/product-editor/productEditorForm.styles";
import { ProductCategoryOption } from "./ProductCategoryOption.component";

const itemClassFor = (depth = 0) =>
  styles.categoryItem[Math.min(depth, styles.categoryItem.length - 1)];

interface ProductCategoryOptionsProps {
  categories: CategoryOptionData[];
}

export function ProductCategoryOptions({
  categories,
}: ProductCategoryOptionsProps) {
  return (
    <>
      {categories.map((category) => (
        <SelectItem
          key={category.id}
          value={category.id}
          className={itemClassFor(category.depth)}
        >
          <ProductCategoryOption
            name={category.name}
            depth={category.depth}
            imageUrl={category.imageUrl}
          />
        </SelectItem>
      ))}
    </>
  );
}

import { CheckboxField } from "@/shared/components/CheckboxField.component";
import type { Category } from "@/shared/api/types";
import { vendorShopSettingsFormStyles } from "../../../styles/shop-settings/vendorShopSettingsForm.styles";

interface VendorCategoryCheckboxListProps {
  categories: Category[];
  selectedSet: Set<string>;
  onToggle: (id: string) => void;
}

export function VendorCategoryCheckboxList({
  categories,
  selectedSet,
  onToggle,
}: VendorCategoryCheckboxListProps) {
  return (
    <div className={vendorShopSettingsFormStyles.categoriesScrollBox}>
      {categories.map((category) => (
        <CheckboxField
          key={category.id}
          id={`vendor-shop-category-${category.id}`}
          checked={selectedSet.has(category.id)}
          onCheckedChange={() => onToggle(category.id)}
          label={category.name}
        />
      ))}
    </div>
  );
}

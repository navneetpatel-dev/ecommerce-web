import { CheckboxField } from "@/shared/components/forms/CheckboxField.component";
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
  const toggleFor = (categoryId: string) => () => onToggle(categoryId);

  return (
    <div className={vendorShopSettingsFormStyles.categoriesScrollBox}>
      {categories.map((category) => (
        <CheckboxField
          key={category.id}
          id={`vendor-shop-category-${category.id}`}
          checked={selectedSet.has(category.id)}
          onCheckedChange={toggleFor(category.id)}
          label={category.name}
        />
      ))}
    </div>
  );
}

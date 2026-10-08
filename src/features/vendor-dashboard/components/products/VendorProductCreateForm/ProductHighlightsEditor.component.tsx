import { useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import {
  PRODUCT_FIELD_LIMITS,
  type ProductListingFormValues,
} from "@/features/products";
import { vendorProductCreateFormStyles } from "../../../styles/products/vendorProductCreateForm.styles";
import { ProductHighlightRow } from "./ProductHighlightRow.component";

interface ProductHighlightsEditorProps {
  highlights: ProductListingFormValues["highlights"];
  disabled: boolean;
  hasError: boolean;
  onChange: (highlights: string[]) => void;
}

export function ProductHighlightsEditor({
  highlights,
  disabled,
  hasError,
  onChange,
}: ProductHighlightsEditorProps) {
  const atMax = highlights.length >= PRODUCT_FIELD_LIMITS.HIGHLIGHTS_MAX;

  const handleUpdateValue = useCallback(
    (index: number, value: string) => {
      const next = [...highlights];
      next[index] = value;
      onChange(next);
    },
    [highlights, onChange],
  );

  const handleRemove = useCallback(
    (index: number) => {
      onChange(highlights.filter((_, rowIndex) => rowIndex !== index));
    },
    [highlights, onChange],
  );

  const handleAdd = useCallback(() => {
    onChange([...highlights, ""]);
  }, [highlights, onChange]);

  return (
    <div className={vendorProductCreateFormStyles.listStack}>
      {highlights.map((item, index) => (
        <ProductHighlightRow
          key={`highlight-${index}`}
          index={index}
          value={item}
          disabled={disabled}
          hasError={hasError}
          onUpdateValue={handleUpdateValue}
          onRemove={handleRemove}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={disabled || atMax}
        onClick={handleAdd}
      >
        <Plus aria-hidden />
        {LABELS.addProductHighlight}
      </Button>
    </div>
  );
}

import { useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import {
  emptySpecRow,
  type ProductListingFormValues,
} from "../../schemas/listing-form/products.schema";
import { PRODUCT_FIELD_LIMITS } from "../../constants/listing-form/productFields";
import { productEditorFormStyles } from "../../styles/product-editor/productEditorForm.styles";
import { ProductSpecRow } from "./ProductSpecRow.component";

interface ProductSpecsEditorProps {
  specs: ProductListingFormValues["specs"];
  disabled: boolean;
  hasError: boolean;
  onChange: (specs: ProductListingFormValues["specs"]) => void;
}

export function ProductSpecsEditor({
  specs,
  disabled,
  hasError,
  onChange,
}: ProductSpecsEditorProps) {
  const atMax = specs.length >= PRODUCT_FIELD_LIMITS.SPECS_MAX;

  const handleUpdateField = useCallback(
    (index: number, field: "key" | "value", value: string) => {
      onChange(
        specs.map((current, rowIndex) =>
          rowIndex === index
            ? field === "key"
              ? { ...current, key: value }
              : { ...current, value: value }
            : current,
        ),
      );
    },
    [specs, onChange],
  );

  const handleRemove = useCallback(
    (index: number) => {
      onChange(specs.filter((_, rowIndex) => rowIndex !== index));
    },
    [specs, onChange],
  );

  const handleAdd = useCallback(() => {
    onChange([...specs, emptySpecRow()]);
  }, [specs, onChange]);

  return (
    <div className={productEditorFormStyles.listStack}>
      {specs.map((row, index) => (
        <ProductSpecRow
          key={`spec-${index}`}
          index={index}
          row={row}
          disabled={disabled}
          hasError={hasError}
          onUpdateField={handleUpdateField}
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
        {LABELS.addProductSpecification}
      </Button>
    </div>
  );
}

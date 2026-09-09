import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  emptySpecRow,
  PRODUCT_FIELD_LIMITS,
  type ProductListingFormValues,
} from "@/features/products";
import { vendorProductCreateFormStyles } from "../../../styles/products/vendorProductCreateForm.styles";

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

  return (
    <div className={vendorProductCreateFormStyles.listStack}>
      {specs.map((row, index) => (
        <div
          key={`spec-${index}`}
          className={vendorProductCreateFormStyles.specRow}
        >
          <Input
            placeholder={LABELS.productSpecKey}
            value={row.key}
            maxLength={PRODUCT_FIELD_LIMITS.SPEC_KEY_MAX}
            error={hasError}
            disabled={disabled}
            onChange={(event) =>
              onChange(
                specs.map((current, rowIndex) =>
                  rowIndex === index
                    ? { ...current, key: event.target.value }
                    : current,
                ),
              )
            }
          />
          <Input
            placeholder={LABELS.productSpecValue}
            value={row.value}
            maxLength={PRODUCT_FIELD_LIMITS.SPEC_VALUE_MAX}
            error={hasError}
            disabled={disabled}
            onChange={(event) =>
              onChange(
                specs.map((current, rowIndex) =>
                  rowIndex === index
                    ? { ...current, value: event.target.value }
                    : current,
                ),
              )
            }
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled}
            onClick={() =>
              onChange(specs.filter((_, rowIndex) => rowIndex !== index))
            }
            aria-label={formatLabel(LABELS.removeNamed, {
              name: LABELS.specifications,
            })}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={disabled || atMax}
        onClick={() => onChange([...specs, emptySpecRow()])}
      >
        <Plus aria-hidden />
        {LABELS.addProductSpecification}
      </Button>
    </div>
  );
}

import { useCallback, type ChangeEvent } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { PRODUCT_FIELD_LIMITS } from "../../constants/listing-form/productFields";
import { type ProductListingFormValues } from "../../schemas/listing-form/products.schema";
import { RowCharCount } from "./RowCharCount.component";
import { productEditorFormStyles } from "../../styles/product-editor/productEditorForm.styles";

type SpecRow = ProductListingFormValues["specs"][number];

interface ProductSpecRowProps {
  index: number;
  row: SpecRow;
  disabled: boolean;
  hasError: boolean;
  onUpdateField: (index: number, field: "key" | "value", value: string) => void;
  onRemove: (index: number) => void;
}

/** One editable specification row (key + value inputs, remove). */
export function ProductSpecRow({
  index,
  row,
  disabled,
  hasError,
  onUpdateField,
  onRemove,
}: ProductSpecRowProps) {
  const handleKeyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onUpdateField(index, "key", event.target.value);
    },
    [index, onUpdateField],
  );

  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onUpdateField(index, "value", event.target.value);
    },
    [index, onUpdateField],
  );

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className={productEditorFormStyles.specRow}>
      <div className={productEditorFormStyles.rowField}>
        <Input
          placeholder={LABELS.productSpecKey}
          value={row.key}
          maxLength={PRODUCT_FIELD_LIMITS.SPEC_KEY_MAX}
          error={hasError}
          disabled={disabled}
          onChange={handleKeyChange}
        />
        <RowCharCount value={row.key} max={PRODUCT_FIELD_LIMITS.SPEC_KEY_MAX} />
      </div>
      <div className={productEditorFormStyles.rowField}>
        <Input
          placeholder={LABELS.productSpecValue}
          value={row.value}
          maxLength={PRODUCT_FIELD_LIMITS.SPEC_VALUE_MAX}
          error={hasError}
          disabled={disabled}
          onChange={handleValueChange}
        />
        <RowCharCount
          value={row.value}
          max={PRODUCT_FIELD_LIMITS.SPEC_VALUE_MAX}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={handleRemove}
        aria-label={formatLabel(LABELS.removeNamed, {
          name: LABELS.specifications,
        })}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

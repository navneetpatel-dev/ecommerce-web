import { useCallback, type ChangeEvent } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { PRODUCT_FIELD_LIMITS } from "../../constants/listing-form/productFields";
import { RowCharCount } from "./RowCharCount.component";
import { productEditorFormStyles } from "../../styles/product-editor/productEditorForm.styles";

interface ProductHighlightRowProps {
  index: number;
  value: string;
  disabled: boolean;
  hasError: boolean;
  onUpdateValue: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

/** One editable highlight row (value input + remove). */
export function ProductHighlightRow({
  index,
  value,
  disabled,
  hasError,
  onUpdateValue,
  onRemove,
}: ProductHighlightRowProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onUpdateValue(index, event.target.value);
    },
    [index, onUpdateValue],
  );

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className={productEditorFormStyles.highlightRow}>
      <div className={productEditorFormStyles.rowField}>
        <Input
          value={value}
          maxLength={PRODUCT_FIELD_LIMITS.HIGHLIGHT_MAX}
          error={hasError}
          disabled={disabled}
          onChange={handleChange}
        />
        <RowCharCount value={value} max={PRODUCT_FIELD_LIMITS.HIGHLIGHT_MAX} />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={handleRemove}
        aria-label={formatLabel(LABELS.removeNamed, {
          name: LABELS.productHighlights,
        })}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

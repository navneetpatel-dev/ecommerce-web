import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  PRODUCT_FIELD_LIMITS,
  type ProductListingFormValues,
} from "@/features/products";
import { vendorProductCreateFormStyles } from "../../../styles/products/vendorProductCreateForm.styles";

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

  return (
    <div className={vendorProductCreateFormStyles.listStack}>
      {highlights.map((item, index) => (
        <div
          key={`highlight-${index}`}
          className={vendorProductCreateFormStyles.highlightRow}
        >
          <Input
            value={item}
            maxLength={PRODUCT_FIELD_LIMITS.HIGHLIGHT_MAX}
            error={hasError}
            disabled={disabled}
            onChange={(event) => {
              const next = [...highlights];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled}
            onClick={() =>
              onChange(highlights.filter((_, rowIndex) => rowIndex !== index))
            }
            aria-label={formatLabel(LABELS.removeNamed, {
              name: LABELS.productHighlights,
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
        onClick={() => onChange([...highlights, ""])}
      >
        <Plus aria-hidden />
        {LABELS.addProductHighlight}
      </Button>
    </div>
  );
}

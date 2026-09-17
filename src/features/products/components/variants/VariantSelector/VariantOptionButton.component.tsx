import { useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { variantSelectorStyles } from "../../../styles/variants/variantSelector.styles";

interface VariantOptionButtonProps {
  groupKey: string;
  value: string;
  available: boolean;
  active: boolean;
  onSelectValue: (key: string, value: string) => void;
}

export function VariantOptionButton({
  groupKey,
  value,
  available,
  active,
  onSelectValue,
}: VariantOptionButtonProps) {
  const handleSelect = useCallback(() => {
    onSelectValue(groupKey, value);
  }, [groupKey, onSelectValue, value]);

  return (
    <DisabledActionHint
      disabled={!available}
      message={LABELS.variantUnavailableHint}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!available}
        aria-pressed={active}
        aria-label={formatLabel(LABELS.variantOptionAria, {
          group: groupKey,
          value,
        })}
        onClick={handleSelect}
        className={variantSelectorStyles.optionButton(active, available)}
      >
        {value}
      </Button>
    </DisabledActionHint>
  );
}

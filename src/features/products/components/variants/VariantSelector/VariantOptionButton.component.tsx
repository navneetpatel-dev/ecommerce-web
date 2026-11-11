import { Button } from "@/shared/components/ui/button";
import { useVariantOptionButton } from "../../../hooks/variants/useVariantOptionButton.hook";
import { variantSelectorStyles } from "../../../styles/variants/variantSelector.styles";

interface VariantOptionButtonProps {
  groupKey: string;
  value: string;
  /** False styles it as sold out; it stays clickable so Notify me can be reached. */
  available: boolean;
  /** Other groups this choice switches (shown as a dashed outline and spoken). */
  changedGroups: string[];
  active: boolean;
  onSelectValue: (key: string, value: string) => void;
}

export function VariantOptionButton({
  groupKey,
  value,
  available,
  changedGroups,
  active,
  onSelectValue,
}: VariantOptionButtonProps) {
  const { handleSelect, ariaLabel, changesOthers } = useVariantOptionButton({
    groupKey,
    value,
    available,
    changedGroups,
    onSelectValue,
  });

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-pressed={active}
      aria-label={ariaLabel}
      onClick={handleSelect}
      className={variantSelectorStyles.optionButton(
        active,
        available,
        changesOthers,
      )}
    >
      {value}
    </Button>
  );
}

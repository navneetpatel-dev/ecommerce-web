import { useCallback } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

/** Click handler and spoken name for one variant option. */
export function useVariantOptionButton({
  groupKey,
  value,
  available,
  changedGroups,
  onSelectValue,
}: {
  groupKey: string;
  value: string;
  available: boolean;
  changedGroups: string[];
  onSelectValue: (key: string, value: string) => void;
}) {
  const handleSelect = useCallback(() => {
    onSelectValue(groupKey, value);
  }, [groupKey, onSelectValue, value]);

  const parts = [
    formatLabel(LABELS.variantOptionAria, { group: groupKey, value }),
  ];
  if (!available) parts.push(LABELS.variantOptionSoldOut);
  if (changedGroups.length) {
    parts.push(
      formatLabel(LABELS.variantOptionChanges, {
        groups: changedGroups.join(` ${LABELS.andWord} `),
      }),
    );
  }

  return {
    handleSelect,
    ariaLabel: parts.join(", "),
    changesOthers: changedGroups.length > 0,
  };
}

export function useVariantAttributeGroup(
  groupKey: string,
  values: string[],
  isActive: (key: string, value: string) => boolean,
) {
  const titleId = `variant-group-${groupKey.replace(/\s+/g, "-")}`;
  const selected = values.find((value) => isActive(groupKey, value));
  return { titleId, selected };
}

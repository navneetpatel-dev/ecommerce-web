export const DELIVERY_RATING_STAR_VALUES = [1, 2, 3, 4, 5] as const;

export function deliveryRatingStarLabel(value: number): string {
  return `${value} star${value === 1 ? "" : "s"}`;
}

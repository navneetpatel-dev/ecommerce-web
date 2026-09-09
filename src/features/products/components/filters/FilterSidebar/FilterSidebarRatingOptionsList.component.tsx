import { FilterSidebarRatingOption } from "./FilterSidebarRatingOption.component";

const RATING_VALUES = [4, 3, 2, 1] as const;

interface FilterSidebarRatingOptionsListProps {
  idPrefix: string;
}

export function FilterSidebarRatingOptionsList({
  idPrefix,
}: FilterSidebarRatingOptionsListProps) {
  return (
    <>
      {RATING_VALUES.map((r) => (
        <FilterSidebarRatingOption key={r} rating={r} idPrefix={idPrefix} />
      ))}
    </>
  );
}

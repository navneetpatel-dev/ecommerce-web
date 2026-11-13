import type { ReviewMediaItem } from "@/shared/api/types";
import { ReviewMediaThumb } from "./ReviewMediaThumb.component";

interface ReviewMediaThumbListProps {
  items: readonly ReviewMediaItem[];
  onOpen: (index: number) => void;
  className: string;
  label: string;
  /** Set inside the viewer: the index on screen gets the selected ring. */
  selectedIndex?: number;
}

/** A review's photos/video as a row of thumbnails (under the review, or in the viewer). */
export function ReviewMediaThumbList({
  items,
  onOpen,
  className,
  label,
  selectedIndex,
}: ReviewMediaThumbListProps) {
  return (
    <ul className={className} aria-label={label}>
      {items.map((item, index) => (
        <ReviewMediaThumb
          key={item.url}
          item={item}
          index={index}
          onOpen={onOpen}
          selection={
            selectedIndex === undefined
              ? undefined
              : { selected: index === selectedIndex, total: items.length }
          }
        />
      ))}
    </ul>
  );
}

import { useCallback, type MouseEvent } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { categoriesTableStyles } from "./categoriesTable.styles";

interface CategorySortableHandleProps {
  id: string;
}

export function CategorySortableHandle({ id }: CategorySortableHandleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const handleClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      ref={setNodeRef}
      className={categoriesTableStyles.sortableHandle}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
      }}
      aria-label={LABELS.dragToReorder}
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      <GripVertical className={categoriesTableStyles.gripIcon} />
    </Button>
  );
}

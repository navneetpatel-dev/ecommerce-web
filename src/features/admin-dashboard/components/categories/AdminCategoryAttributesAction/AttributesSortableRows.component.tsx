"use client";

import type { CategoryAttribute } from "@/shared/api/types";
import { SortableAttributeRow } from "./SortableAttributeRow.component";

interface AttributesSortableRowsProps {
  rows: CategoryAttribute[];
  disabled: boolean;
  onEdit: (row: CategoryAttribute) => void;
  onDelete: (attributeId: string) => void;
}

export function AttributesSortableRows({
  rows,
  disabled,
  onEdit,
  onDelete,
}: AttributesSortableRowsProps) {
  return (
    <>
      {rows.map((row) => {
        const editRow = () => onEdit(row);
        const deleteRow = () => onDelete(row.id);
        return (
          <SortableAttributeRow
            key={row.id}
            row={row}
            disabled={disabled}
            onEdit={editRow}
            onDelete={deleteRow}
          />
        );
      })}
    </>
  );
}

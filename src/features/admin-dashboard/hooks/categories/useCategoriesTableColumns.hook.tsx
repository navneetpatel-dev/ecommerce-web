import { useMemo } from "react";
import type { DataTableColumn } from "@/shared/components/DataTable.component";
import { TableCellImage } from "@/shared/components/TableCellImage.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { CATEGORY_STATUS } from "@/shared/constants/statuses";
import type { Category } from "@/shared/api/types";
import { categoriesTableStyles } from "../../styles/categories/categoriesTable.styles";
import { CategorySortableHandle } from "../../components/categories/CategoriesTable/CategorySortableHandle.component";

export function useCategoriesTableColumns() {
  const columns: DataTableColumn<Category>[] = useMemo(
    () => [
      {
        id: "drag",
        header: "",
        truncate: false,
        className: categoriesTableStyles.dragColWidth,
        hideOnMobile: true,
        cell: (row) => <CategorySortableHandle id={row.id} />,
      },
      {
        id: "image",
        header: LABELS.imageUrl,
        truncate: false,
        className: categoriesTableStyles.imageColWidth,
        cell: (row) => <TableCellImage src={row.imageUrl} alt={row.name} />,
      },
      {
        id: "name",
        header: LABELS.name,
        className: categoriesTableStyles.nameColumn,
        accessor: "name",
      },
      {
        id: "slug",
        header: LABELS.slug,
        className: categoriesTableStyles.slugColumn,
        accessor: "slug",
      },
      {
        id: "status",
        header: LABELS.status,
        truncate: false,
        cell: (row) => (
          <StatusBadge
            status={row.status || CATEGORY_STATUS.ACTIVE}
            label={
              row.status === CATEGORY_STATUS.ARCHIVED
                ? LABELS.categoryStatusArchived
                : LABELS.categoryStatusActive
            }
          />
        ),
      },
      {
        id: "parent",
        header: LABELS.parentName,
        cell: (row) => row.parent?.name || LABELS.parentCategoryNone,
      },
    ],
    [],
  );

  return columns;
}

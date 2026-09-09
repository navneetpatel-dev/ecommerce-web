"use client";

import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { PaginationResultSummary } from "@/shared/components/PaginationResultSummary.component";
import { LABELS } from "@/shared/constants/labels";
import { dataTableHeaderStyles } from "../../styles/data-table/dataTable.styles";

export type DataTableHeaderProps = {
  title?: ReactNode;
  toolbar?: ReactNode;
  onRefresh?: () => void;
  from?: number;
  to?: number;
  total?: number;
};

export function DataTableHeader({
  title,
  toolbar,
  onRefresh,
  from,
  to,
  total,
}: DataTableHeaderProps) {
  const showSummary = total != null && from != null && to != null && total > 0;

  return (
    <div className={dataTableHeaderStyles.container}>
      <div className={dataTableHeaderStyles.titleGroup}>
        {title ? (
          typeof title === "string" ? (
            <h1 className={dataTableHeaderStyles.title}>{title}</h1>
          ) : (
            title
          )
        ) : null}
        {showSummary ? (
          <PaginationResultSummary from={from!} to={to!} total={total!} />
        ) : null}
      </div>
      <ButtonGroup className={dataTableHeaderStyles.buttonGroup}>
        {toolbar}
        {onRefresh ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            fullWidth="mobile"
            onClick={onRefresh}
          >
            {LABELS.refresh}
          </Button>
        ) : null}
      </ButtonGroup>
    </div>
  );
}

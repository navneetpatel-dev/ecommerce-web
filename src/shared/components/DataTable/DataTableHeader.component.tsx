"use client";

import type { ReactNode } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { PaginationResultSummary } from "@/shared/components/navigation/PaginationResultSummary.component";
import { LABELS } from "@/shared/constants/labels";
import { dataTableHeaderStyles } from "../../styles/data-table/dataTable.styles";

export type DataTableHeaderProps = {
  title?: ReactNode;
  titleLevel?: 1 | 2;
  toolbar?: ReactNode;
  onRefresh?: () => void;
  from?: number;
  to?: number;
  total?: number;
  isFiltered?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
};

export function DataTableHeader({
  title,
  titleLevel = 1,
  toolbar,
  onRefresh,
  from,
  to,
  total,
  isFiltered,
  isFullscreen,
  onToggleFullscreen,
}: DataTableHeaderProps) {
  const showSummary = total != null && from != null && to != null && total > 0;

  return (
    <div className={dataTableHeaderStyles.container}>
      <div className={dataTableHeaderStyles.titleGroup}>
        {title ? (
          typeof title === "string" ? (
            titleLevel === 1 ? (
              <h1 className={dataTableHeaderStyles.title}>{title}</h1>
            ) : (
              <h2 className={dataTableHeaderStyles.title}>{title}</h2>
            )
          ) : (
            title
          )
        ) : null}
        {showSummary ? (
          <PaginationResultSummary
            from={from!}
            to={to!}
            total={total!}
            isFiltered={isFiltered}
          />
        ) : null}
      </div>
      <ButtonGroup className={dataTableHeaderStyles.buttonGroup}>
        {toolbar}
        {onToggleFullscreen ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onToggleFullscreen}
            className="h-9 gap-1.5 text-body-sm font-medium"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={
              isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen focus mode"
            }
          >
            {isFullscreen ? (
              <Minimize2 className="size-4 text-ink-muted" aria-hidden />
            ) : (
              <Maximize2 className="size-4 text-ink-muted" aria-hidden />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </Button>
        ) : null}
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

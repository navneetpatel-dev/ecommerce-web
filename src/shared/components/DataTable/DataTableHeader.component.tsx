"use client";

import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";

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
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 space-y-1">
        {title ? (
          typeof title === "string" ? (
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {title}
            </h1>
          ) : (
            title
          )
        ) : null}
        {showSummary ? (
          <p className="text-body-sm text-ink-muted">
            {formatLabel(LABELS.showingResults, {
              from: from!,
              to: to!,
              total: total!,
            })}
          </p>
        ) : null}
      </div>
      <ButtonGroup className="sm:shrink-0">
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

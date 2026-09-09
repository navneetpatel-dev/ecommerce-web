"use client";

import { Columns2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { sortBarStyles } from "../../../styles/sort/sortBar.styles";
import { SortOptionsList } from "./SortOptionsList.component";

export interface SortBarProps {
  sort: string | undefined;
  totalProducts: number | undefined;
  isFetching: boolean;
  onSortChange: (value: string) => void;
  compareMode?: boolean;
  onToggleCompare?: () => void;
  /** Hide desktop sort control on small screens when a mobile Sort sheet exists. */
  hideSortOnMobile?: boolean;
  className?: string;
}

export function SortBar({
  sort,
  totalProducts,
  isFetching,
  onSortChange,
  compareMode = false,
  onToggleCompare,
  hideSortOnMobile = false,
  className,
}: SortBarProps) {
  const countLabel =
    totalProducts !== undefined
      ? formatLabel(
          totalProducts === 1
            ? LABELS.productCountSingular
            : LABELS.productCountPlural,
          { count: formatInrAmount(totalProducts) },
        )
      : isFetching
        ? LABELS.updatingEllipsis
        : LABELS.browseCollection;

  return (
    <div className={sortBarStyles.root(className)}>
      <p className={sortBarStyles.countText}>{countLabel}</p>

      <div className={sortBarStyles.actionsWrapper}>
        <Select value={sort || "trending"} onValueChange={onSortChange}>
          <SelectTrigger
            aria-label={LABELS.sort}
            className={sortBarStyles.selectTrigger(hideSortOnMobile)}
          >
            <SelectValue placeholder={LABELS.sort} />
          </SelectTrigger>
          <SelectContent>
            <SortOptionsList />
          </SelectContent>
        </Select>

        {onToggleCompare ? (
          <Button
            type="button"
            variant={compareMode ? "default" : "secondary"}
            size="sm"
            className={sortBarStyles.compareButton}
            onClick={onToggleCompare}
            aria-pressed={compareMode}
          >
            <Columns2 size={14} strokeWidth={1.75} aria-hidden />
            {LABELS.compare}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

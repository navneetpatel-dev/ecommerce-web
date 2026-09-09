import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import type { ScheduledReportTypeOption } from "../../hooks/useScheduledReportsCatalog.hook";

function getCategoryLabel(audience?: string, financial?: boolean): string {
  if (audience === "admin_finance" || financial) return "Finance";
  if (audience === "admin_ops") return "Operations";
  return "Catalog";
}

interface ReportTypeCheckboxGroupProps {
  reports: ScheduledReportTypeOption[];
  selectedTypes: string[];
  onToggle: (type: string) => void;
  onResetFilters: () => void;
}

/** Checkbox grid of scheduled-report types, with a per-item hover tooltip. */
export function ReportTypeCheckboxGroup({
  reports,
  selectedTypes,
  onToggle,
  onResetFilters,
}: ReportTypeCheckboxGroupProps) {
  if (reports.length === 0) {
    return (
      <div className="py-10 text-center rounded-md border border-dashed border-line bg-surface/40">
        <p className="text-body font-medium text-ink-muted">
          {LABELS.scheduledReportsNoMatches}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="mt-2 text-brand text-xs"
        >
          Reset search
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 pt-1">
        {reports.map((option) => {
          const isChecked = selectedTypes.includes(option.type);
          const category = getCategoryLabel(option.audience, option.financial);
          return (
            <Tooltip key={option.type}>
              <TooltipTrigger asChild>
                <label
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 text-body-sm transition-colors cursor-pointer select-none",
                    isChecked
                      ? "border-brand bg-brand-subtle/30 text-ink shadow-xs ring-1 ring-brand/20"
                      : "border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-raised",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggle(option.type)}
                    />
                    <span
                      className={cn(
                        "truncate text-body-sm",
                        isChecked
                          ? "font-semibold text-ink"
                          : "font-normal text-ink",
                      )}
                    >
                      {option.label}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider text-ink-faint group-hover:text-ink-muted">
                    {category}
                  </span>
                </label>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                {option.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import type { ScheduledReportTypeOption } from "../../../hooks/settings/useScheduledReportsCatalog.hook";
import { platformSettingsFormStyles as styles } from "../../../styles/settings/platformSettingsForm.styles";

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
      <div className={styles.emptyContainer}>
        <p className={styles.emptyText}>{LABELS.scheduledReportsNoMatches}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className={styles.emptyResetButton}
        >
          Reset search
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className={styles.grid}>
        {reports.map((option) => {
          const isChecked = selectedTypes.includes(option.type);
          const category = getCategoryLabel(option.audience, option.financial);
          return (
            <Tooltip key={option.type}>
              <TooltipTrigger asChild>
                <label
                  className={cn(
                    styles.itemCardBase,
                    isChecked ? styles.itemCardActive : styles.itemCardInactive,
                  )}
                >
                  <div className={styles.itemLeft}>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggle(option.type)}
                    />
                    <span
                      className={cn(
                        styles.itemLabelBase,
                        isChecked
                          ? styles.itemLabelActive
                          : styles.itemLabelInactive,
                      )}
                    >
                      {option.label}
                    </span>
                  </div>
                  <span className={styles.itemCategory}>{category}</span>
                </label>
              </TooltipTrigger>
              <TooltipContent side="top" className={styles.tooltipContent}>
                {option.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

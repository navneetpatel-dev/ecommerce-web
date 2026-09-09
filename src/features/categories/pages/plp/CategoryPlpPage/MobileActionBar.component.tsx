import { ArrowUpDown, Columns2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { categoryPlpPageStyles as styles } from "./categoryPlpPage.styles";

interface MobileActionBarProps {
  onOpenFilters: () => void;
  onOpenSort: () => void;
  compareMode: boolean;
  onToggleCompareMode: () => void;
}

export function MobileActionBar({
  onOpenFilters,
  onOpenSort,
  compareMode,
  onToggleCompareMode,
}: MobileActionBarProps) {
  return (
    <div className={styles.actionBarContainer}>
      <div className={styles.buttonRow}>
        <Button
          variant="secondary"
          size="sm"
          className={styles.actionButton}
          onClick={onOpenFilters}
        >
          <SlidersHorizontal size={14} strokeWidth={1.75} aria-hidden />
          <span className={styles.buttonText}>{LABELS.filters}</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={styles.actionButton}
          onClick={onOpenSort}
        >
          <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
          <span className={styles.buttonText}>{LABELS.sort}</span>
        </Button>
        <Button
          variant={compareMode ? "default" : "secondary"}
          size="sm"
          className={styles.actionButton}
          onClick={onToggleCompareMode}
          aria-pressed={compareMode}
        >
          <Columns2 size={14} strokeWidth={1.75} aria-hidden />
          <span className={styles.buttonText}>{LABELS.compare}</span>
        </Button>
      </div>
    </div>
  );
}

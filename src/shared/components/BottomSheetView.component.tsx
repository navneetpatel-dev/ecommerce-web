import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { bottomSheetViewStyles } from "./dialogComponents.styles";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Hide the overlay from this breakpoint upward. Default `md` keeps filters mobile-only. */
  hideFrom?: "md" | "lg" | "xl";
}

export function BottomSheetView({
  open,
  onClose,
  title,
  children,
  hideFrom = "md",
}: BottomSheetProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        bottomSheetViewStyles.base,
        hideFrom === "md" && bottomSheetViewStyles.hideMd,
        hideFrom === "lg" && bottomSheetViewStyles.hideLg,
        hideFrom === "xl" && bottomSheetViewStyles.hideXl,
      )}
    >
      <div className={bottomSheetViewStyles.backdrop} onClick={onClose} />
      <div
        className={bottomSheetViewStyles.sheet}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className={bottomSheetViewStyles.handleWrap}>
          <div className={bottomSheetViewStyles.handle} />
        </div>
        <div className={bottomSheetViewStyles.header}>
          {title && <h2 className={bottomSheetViewStyles.title}>{title}</h2>}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className={bottomSheetViewStyles.closeButton}
            aria-label={LABELS.close}
          >
            <X size={20} />
          </Button>
        </div>
        <div className={bottomSheetViewStyles.content}>{children}</div>
      </div>
    </div>
  );
}

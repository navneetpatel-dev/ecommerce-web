"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { useModalOverlay } from "@/shared/hooks/ui/useModalOverlay.hook";
import { bottomSheetViewStyles } from "../../styles/dialogs/dialogComponents.styles";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Visible heading — also the dialog's accessible name, so pass one. */
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
  const panelRef = useRef<HTMLDivElement>(null);
  useModalOverlay({ open, onClose, panelRef });

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
      {/* Hidden, untabbable close target — see OVERLAY_BACKDROP. */}
      <Button
        type="button"
        variant="ghost"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className={bottomSheetViewStyles.backdrop}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
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

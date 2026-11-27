"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/shared/utils/dom/cn";
import { dialogStyles } from "../../styles/ui/dialog.styles";
import { IconCloseButton } from "./icon-close-button";

/**
 * Where the ✕ sits: on its own `row` above the body, in the top `corner` beside a header that
 * leaves room for it, or `fullscreen` floating over the surface.
 */
export type DialogCloseButtonPlacement = "row" | "corner" | "fullscreen";

const WRAP_CLASS: Record<DialogCloseButtonPlacement, string> = {
  row: dialogStyles.closeButtonWrapDefault,
  corner: dialogStyles.closeButtonWrapCorner,
  fullscreen: dialogStyles.closeButtonWrapFullscreen,
};

interface DialogCloseButtonProps {
  placement: DialogCloseButtonPlacement;
  className?: string;
  onPointerClose: () => void;
}

export function DialogCloseButton({
  placement,
  className,
  onPointerClose,
}: DialogCloseButtonProps) {
  return (
    <div className={cn(dialogStyles.closeButtonWrap, WRAP_CLASS[placement])}>
      <DialogPrimitive.Close asChild>
        <IconCloseButton
          variant={placement === "fullscreen" ? "floating" : "dialog"}
          className={className}
          onPointerDown={(event) => {
            // Keep focus in the dialog until close so field blur doesn't flash validation.
            event.preventDefault();
            onPointerClose();
          }}
        />
      </DialogPrimitive.Close>
    </div>
  );
}

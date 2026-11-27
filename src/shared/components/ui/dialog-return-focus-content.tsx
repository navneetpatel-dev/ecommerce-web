"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRowActionsReturnFocus } from "@/shared/hooks/dialogs/useRowActionsReturnFocus.hook";

/** Dialog content that mounts only while open, so it can remember what opened it. */
export const DialogReturnFocusContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ onCloseAutoFocus, ...props }, ref) => {
  const handleCloseAutoFocus = useRowActionsReturnFocus(onCloseAutoFocus);

  return (
    <DialogPrimitive.Content
      ref={ref}
      {...props}
      onCloseAutoFocus={handleCloseAutoFocus}
    />
  );
});
DialogReturnFocusContent.displayName = "DialogReturnFocusContent";

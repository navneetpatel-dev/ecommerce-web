"use client";

import { forwardRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { cn } from "@/shared/utils/dom/cn";
import type { RowActionButtonProps } from "./RowActionButton.component";

/** Out-of-menu form of `RowActionButton`: detail headers, toolbars and previews. */
export const StandaloneRowAction = forwardRef<
  HTMLButtonElement,
  RowActionButtonProps
>(function StandaloneRowAction(
  {
    label,
    icon: Icon,
    kind: _kind,
    disabledHint,
    attentionClassName,
    className,
    disabled,
    ...buttonProps
  },
  ref,
) {
  const button = (
    <Button
      ref={ref}
      size="sm"
      variant="outline"
      {...buttonProps}
      disabled={disabled}
      className={cn(className, attentionClassName)}
    >
      <Icon strokeWidth={2.25} aria-hidden />
      <span>{label}</span>
    </Button>
  );

  if (!disabled || !disabledHint) return button;

  return (
    <DisabledActionHint disabled message={disabledHint} block>
      {button}
    </DisabledActionHint>
  );
});

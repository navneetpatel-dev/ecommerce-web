"use client";

import { forwardRef, useContext } from "react";
import type { LucideIcon } from "lucide-react";
import type { ButtonProps } from "@/shared/components/ui/button";
import type { RowActionKind } from "../../../types/data-table/rowActions.types";
import { RowActionsContext } from "./rowActionsContext";
import { RowActionMarker } from "./RowActionMarker.component";
import { StandaloneRowAction } from "./StandaloneRowAction.component";

export interface RowActionButtonProps extends Omit<
  ButtonProps,
  "children" | "asChild" | "fullWidth"
> {
  label: string;
  icon: LucideIcon;
  kind?: RowActionKind;
  /** Shown when the action is disabled. */
  disabledHint?: string;
  /** Applied both inside and outside the menu. */
  attentionClassName?: string;
}

/**
 * The one way to put an action in a row ⋮ menu. Inside the menu it only describes itself, so
 * `className`, `variant` and `size` apply solely when it renders as a button elsewhere.
 */
export const RowActionButton = forwardRef<
  HTMLButtonElement,
  RowActionButtonProps
>(function RowActionButton(props, ref) {
  const registry = useContext(RowActionsContext);

  return registry ? (
    <RowActionMarker registry={registry} {...props} />
  ) : (
    <StandaloneRowAction ref={ref} {...props} />
  );
});

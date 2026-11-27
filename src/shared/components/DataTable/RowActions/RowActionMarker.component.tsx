"use client";

import { useRef } from "react";
import { useRegisterRowAction } from "../../../hooks/data-table/useRegisterRowAction.hook";
import type { RowActionRegistry } from "../../../types/data-table/rowActions.types";
import type { RowActionButtonProps } from "./RowActionButton.component";

/** In-menu form of `RowActionButton`: registers the action and draws nothing. */
export function RowActionMarker({
  registry,
  label,
  icon,
  kind = "default",
  disabled = false,
  disabledHint,
  loading = false,
  attentionClassName,
  onClick,
  "aria-label": ariaLabel,
  "aria-haspopup": ariaHasPopup,
}: RowActionButtonProps & { registry: RowActionRegistry }) {
  const markerRef = useRef<HTMLSpanElement>(null);
  useRegisterRowAction(registry, markerRef, {
    label,
    icon,
    kind,
    disabled,
    disabledHint,
    loading,
    attentionClassName,
    ariaLabel,
    ariaHasPopup,
    onClick,
  });

  return <span ref={markerRef} data-row-action-marker="" />;
}

"use client";

import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type MouseEventHandler,
  type RefObject,
} from "react";
import type {
  RowActionEntry,
  RowActionRegistry,
} from "../../types/data-table/rowActions.types";

export type RowActionRegistration = Omit<
  RowActionEntry,
  "id" | "marker" | "run"
> & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

/** Keeps one menu entry in step with the leaf that renders the marker. */
export function useRegisterRowAction(
  registry: RowActionRegistry,
  markerRef: RefObject<HTMLSpanElement | null>,
  {
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
  }: RowActionRegistration,
) {
  const id = useId();
  // Handlers change identity on most renders; reading them late avoids re-registering.
  const onClickRef = useRef(onClick);
  useLayoutEffect(() => {
    onClickRef.current = onClick;
  });
  const run = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    onClickRef.current?.(event);
  }, []);

  useLayoutEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    registry.upsert({
      id,
      marker,
      run,
      label,
      icon,
      kind,
      disabled,
      disabledHint,
      loading,
      attentionClassName,
      ariaLabel,
      ariaHasPopup,
    });
  }, [
    registry,
    markerRef,
    id,
    run,
    label,
    icon,
    kind,
    disabled,
    disabledHint,
    loading,
    attentionClassName,
    ariaLabel,
    ariaHasPopup,
  ]);

  useLayoutEffect(() => () => registry.remove(id), [registry, id]);
}

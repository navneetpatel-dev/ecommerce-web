"use client";

import { useCallback, useMemo, useState } from "react";
import type { AdminBroadcastRecord } from "../../api/notifications/notifications.api";
import {
  INITIAL_BROADCAST_STATE,
  type BroadcastBuilderState,
} from "../../types/notifications/broadcastBuilder.types";
import {
  broadcastStateFrom,
  buildTargetConfig,
  withBroadcastPreset,
} from "../../utils/notifications/broadcastPayload";
import { useBroadcastAudiencePreview } from "./useBroadcastAudiencePreview.hook";
import { useBroadcastRenderPreview } from "./useBroadcastRenderPreview.hook";
import { useBroadcastSend } from "./useBroadcastSend.hook";

export function useBroadcastBuilder(onSuccess?: () => void) {
  const [state, setState] = useState<BroadcastBuilderState>(
    INITIAL_BROADCAST_STATE,
  );
  const [error, setError] = useState<string | null>(null);

  const targetConfig = useMemo(() => buildTargetConfig(state), [state]);

  const patch = useCallback(
    (partial: Partial<BroadcastBuilderState>) =>
      setState((prev) => ({ ...prev, ...partial })),
    [],
  );

  const { preview, previewLoading, loadMoreSamples, sampleLoadingMore } =
    useBroadcastAudiencePreview(targetConfig, state, setError);
  const { renderPreview, previewTheme, setPreviewTheme } =
    useBroadcastRenderPreview(state);

  const applyPreset = useCallback((presetId: string) => {
    setState((prev) => withBroadcastPreset(prev, presetId));
  }, []);

  const {
    pending,
    testNotice,
    resultMsg,
    sendTest,
    submit,
    clearResult,
    clearNotices,
  } = useBroadcastSend({ state, targetConfig, setError, onSuccess });

  const duplicateFrom = useCallback(
    (record: AdminBroadcastRecord) => {
      setState(broadcastStateFrom(record));
      clearResult();
      setError(null);
    },
    [clearResult],
  );

  return {
    state,
    patch,
    preview,
    previewLoading,
    loadMoreSamples,
    sampleLoadingMore,
    renderPreview,
    previewTheme,
    setPreviewTheme,
    applyPreset,
    sendTest,
    submit,
    duplicateFrom,
    pending,
    testNotice,
    error,
    resultMsg,
    reset: () => {
      setState(INITIAL_BROADCAST_STATE);
      setError(null);
      clearNotices();
    },
  };
}

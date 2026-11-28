"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  notificationsApi,
  type BroadcastTargetConfig,
  type BroadcastTargetsPreview,
} from "../../api/notifications/notifications.api";
import type { BroadcastBuilderState } from "../../types/notifications/broadcastBuilder.types";

/** Who the chosen audience reaches: a debounced estimate and more sample recipients. */
export function useBroadcastAudiencePreview(
  targetConfig: BroadcastTargetConfig,
  state: Pick<BroadcastBuilderState, "classification" | "channels">,
  setError: (message: string | null) => void,
) {
  const [preview, setPreview] = useState<BroadcastTargetsPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [samplePage, setSamplePage] = useState(1);
  const [sampleLoadingMore, setSampleLoadingMore] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setPreviewLoading(true);
      setSamplePage(1);
      void notificationsApi
        .previewBroadcastTargets({
          targetConfig,
          classification: state.classification,
          channels: state.channels,
          page: 1,
          limit: 25,
        })
        .then((res) => {
          setError(null);
          setPreview(res);
        })
        .catch((err) => {
          setPreview(null);
          setError(getApiErrorMessage(err, "Unable to estimate recipients."));
        })
        .finally(() => setPreviewLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [targetConfig, state.classification, state.channels, setError]);

  const loadMoreSamples = useCallback(async () => {
    if (!preview?.sampleHasMore || sampleLoadingMore) return;
    const nextPage = samplePage + 1;
    setSampleLoadingMore(true);
    try {
      const res = await notificationsApi.previewBroadcastTargets({
        targetConfig,
        classification: state.classification,
        channels: state.channels,
        page: nextPage,
        limit: 25,
      });
      setPreview((prev) =>
        prev
          ? {
              ...prev,
              sampleRecipients: [
                ...prev.sampleRecipients,
                ...res.sampleRecipients,
              ],
              sampleHasMore: res.sampleHasMore,
            }
          : res,
      );
      setSamplePage(nextPage);
    } finally {
      setSampleLoadingMore(false);
    }
  }, [
    preview?.sampleHasMore,
    sampleLoadingMore,
    samplePage,
    targetConfig,
    state.classification,
    state.channels,
  ]);

  return { preview, previewLoading, loadMoreSamples, sampleLoadingMore };
}

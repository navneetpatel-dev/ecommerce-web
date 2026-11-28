"use client";

import { useEffect, useState } from "react";
import { notificationsApi } from "../../api/notifications/notifications.api";
import type { BroadcastBuilderState } from "../../types/notifications/broadcastBuilder.types";

/** The email as the server would render it, refreshed as the wording changes. */
export function useBroadcastRenderPreview(state: BroadcastBuilderState) {
  const [renderPreview, setRenderPreview] = useState<{
    subject: string;
    html: string;
  } | null>(null);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (state.step !== 2) return;
    const t = setTimeout(() => {
      void notificationsApi
        .renderBroadcastPreview({
          subject: state.subject || "Announcement",
          message: state.message || "Your broadcast message will appear here.",
          ctaLabel: state.ctaEnabled ? state.ctaLabel : undefined,
          ctaUrl: state.ctaEnabled ? state.ctaUrl : undefined,
          classification: state.classification,
          theme: previewTheme,
        })
        .then((res) =>
          setRenderPreview({ subject: res.subject, html: res.html }),
        )
        .catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [
    state.step,
    state.subject,
    state.message,
    state.ctaEnabled,
    state.ctaLabel,
    state.ctaUrl,
    state.classification,
    previewTheme,
  ]);

  return { renderPreview, previewTheme, setPreviewTheme };
}

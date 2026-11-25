"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  notificationsApi,
  type AdminBroadcastRecord,
  type BroadcastNotificationPayload,
  type BroadcastTargetConfig,
  type BroadcastTargetsPreview,
} from "../../api/notifications/notifications.api";
import {
  BROADCAST_PRESETS,
  INITIAL_BROADCAST_STATE,
  type BroadcastBuilderState,
} from "./broadcastBuilder.types";

function parseEmails(raw: string): string[] {
  return raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.includes("@"));
}

export function buildTargetConfig(
  s: BroadcastBuilderState,
): BroadcastTargetConfig {
  return {
    mode: s.mode,
    allUsers: s.mode === "roles" ? s.allUsers : undefined,
    roles: s.mode === "roles" && !s.allUsers ? s.roles : undefined,
    userIds:
      s.mode === "users" && s.selectedUsers.length
        ? s.selectedUsers.map((u) => u.id)
        : undefined,
    emails:
      s.mode === "users" && parseEmails(s.emailsText).length
        ? parseEmails(s.emailsText)
        : undefined,
    userSegment: s.mode === "user_segment" ? s.userSegment : undefined,
    vendorSegment:
      s.mode === "vendor_segment"
        ? {
            ...s.vendorSegment,
            categoryIds: s.selectedCategories.length
              ? s.selectedCategories.map((c) => c.id)
              : undefined,
          }
        : undefined,
    excludeUserIds: s.excludeUsers.length
      ? s.excludeUsers.map((u) => u.id)
      : undefined,
    excludeRoles: s.excludeRoles.length ? s.excludeRoles : undefined,
  };
}

export function useBroadcastBuilder(onSuccess?: () => void) {
  const [state, setState] = useState<BroadcastBuilderState>(
    INITIAL_BROADCAST_STATE,
  );
  const [preview, setPreview] = useState<BroadcastTargetsPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [samplePage, setSamplePage] = useState(1);
  const [sampleLoadingMore, setSampleLoadingMore] = useState(false);
  const [renderPreview, setRenderPreview] = useState<{
    subject: string;
    html: string;
  } | null>(null);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [pending, setPending] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const targetConfig = useMemo(() => buildTargetConfig(state), [state]);

  const patch = useCallback(
    (partial: Partial<BroadcastBuilderState>) =>
      setState((prev) => ({ ...prev, ...partial })),
    [],
  );

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
  }, [targetConfig, state.classification, state.channels]);

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

  const applyPreset = useCallback((presetId: string) => {
    const preset = BROADCAST_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setState((prev) => ({
      ...prev,
      classification: preset.classification,
      priority: preset.priority ?? prev.priority,
      subject: preset.subject,
      message: preset.message,
      ctaEnabled: Boolean(preset.ctaLabel || preset.ctaUrl),
      ctaLabel: preset.ctaLabel ?? "",
      ctaUrl: preset.ctaUrl ?? "",
    }));
  }, []);

  const buildPayload = useCallback(
    (): BroadcastNotificationPayload => ({
      ...targetConfig,
      subject: state.subject.trim(),
      message: state.message.trim(),
      ctaLabel: state.ctaEnabled
        ? state.ctaLabel.trim() || undefined
        : undefined,
      ctaUrl: state.ctaEnabled ? state.ctaUrl.trim() || undefined : undefined,
      classification: state.classification,
      priority: state.priority,
      channels: state.channels,
      scheduledAt:
        state.scheduleEnabled && state.scheduledAt
          ? new Date(state.scheduledAt).toISOString()
          : null,
    }),
    [state, targetConfig],
  );

  const sendTest = useCallback(async () => {
    setError(null);
    setTestNotice(null);
    if (!state.subject.trim() || !state.message.trim()) {
      setError("Enter a subject and message before sending a test.");
      return;
    }
    setPending(true);
    try {
      const res = await notificationsApi.sendBroadcastTest(buildPayload());
      setTestNotice(`Test sent to ${res.sentTo}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to send test broadcast."));
    } finally {
      setPending(false);
    }
  }, [state.subject, state.message, buildPayload]);

  const submit = useCallback(async () => {
    setError(null);
    setResultMsg(null);
    if (!state.subject.trim() || !state.message.trim()) {
      setError("Enter a subject and message before sending.");
      return;
    }
    setPending(true);
    try {
      const res = await notificationsApi.broadcast(buildPayload());
      setResultMsg(
        res.status === "SCHEDULED"
          ? `Broadcast scheduled for ${res.targeted} recipients.`
          : res.status === "PROCESSING"
            ? `Broadcast queued for background delivery to ${res.targeted} recipients.`
            : `Queued for ${res.queued} of ${res.targeted} targeted recipients.`,
      );
      onSuccess?.();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to send broadcast."));
    } finally {
      setPending(false);
    }
  }, [state.subject, state.message, buildPayload, onSuccess]);

  const duplicateFrom = useCallback((record: AdminBroadcastRecord) => {
    const cfg = record.targetConfig ?? {};
    setState({
      ...INITIAL_BROADCAST_STATE,
      step: 1,
      mode: cfg.mode ?? "roles",
      allUsers: Boolean(cfg.allUsers),
      roles: cfg.roles ?? (cfg.role ? [cfg.role] : ["CUSTOMER"]),
      userSegment: cfg.userSegment ?? { status: "ACTIVE" },
      vendorSegment: cfg.vendorSegment ?? { vendorStatus: "APPROVED" },
      excludeRoles: cfg.excludeRoles ?? [],
      channels: record.channels?.length ? record.channels : ["EMAIL"],
      classification: record.classification ?? "operational",
      priority: record.priority ?? "standard",
      subject: record.subject,
      message: record.message,
      ctaEnabled: Boolean(record.ctaLabel || record.ctaUrl),
      ctaLabel: record.ctaLabel ?? "",
      ctaUrl: record.ctaUrl ?? "",
    });
    setResultMsg(null);
    setError(null);
  }, []);

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
      setResultMsg(null);
      setTestNotice(null);
    },
  };
}

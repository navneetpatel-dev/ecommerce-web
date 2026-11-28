import type {
  AdminBroadcastRecord,
  BroadcastNotificationPayload,
  BroadcastResult,
  BroadcastTargetConfig,
} from "../../api/notifications/notifications.api";
import { BROADCAST_PRESETS } from "../../constants/notifications/broadcastPresets";
import {
  INITIAL_BROADCAST_STATE,
  type BroadcastBuilderState,
} from "../../types/notifications/broadcastBuilder.types";

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

/** The request body for sending (or testing) what the builder holds. */
export function buildBroadcastPayload(
  state: BroadcastBuilderState,
  targetConfig: BroadcastTargetConfig,
): BroadcastNotificationPayload {
  return {
    ...targetConfig,
    subject: state.subject.trim(),
    message: state.message.trim(),
    ctaLabel: state.ctaEnabled ? state.ctaLabel.trim() || undefined : undefined,
    ctaUrl: state.ctaEnabled ? state.ctaUrl.trim() || undefined : undefined,
    classification: state.classification,
    priority: state.priority,
    channels: state.channels,
    scheduledAt:
      state.scheduleEnabled && state.scheduledAt
        ? new Date(state.scheduledAt).toISOString()
        : null,
  };
}

/** The builder with a preset's wording filled in; unknown ids change nothing. */
export function withBroadcastPreset(
  state: BroadcastBuilderState,
  presetId: string,
): BroadcastBuilderState {
  const preset = BROADCAST_PRESETS.find((p) => p.id === presetId);
  if (!preset) return state;
  return {
    ...state,
    classification: preset.classification,
    priority: preset.priority ?? state.priority,
    subject: preset.subject,
    message: preset.message,
    ctaEnabled: Boolean(preset.ctaLabel || preset.ctaUrl),
    ctaLabel: preset.ctaLabel ?? "",
    ctaUrl: preset.ctaUrl ?? "",
  };
}

/** A new builder filled from a past broadcast, to send something like it. */
export function broadcastStateFrom(
  record: AdminBroadcastRecord,
): BroadcastBuilderState {
  const cfg = record.targetConfig ?? {};
  return {
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
  };
}

/** What to tell the admin once the server has accepted a broadcast. */
export function broadcastResultMessage(result: BroadcastResult): string {
  if (result.status === "SCHEDULED") {
    return `Broadcast scheduled for ${result.targeted} recipients.`;
  }
  if (result.status === "PROCESSING") {
    return `Broadcast queued for background delivery to ${result.targeted} recipients.`;
  }
  return `Queued for ${result.queued} of ${result.targeted} targeted recipients.`;
}

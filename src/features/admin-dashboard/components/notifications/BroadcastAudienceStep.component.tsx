"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldFrame } from "@/shared/components/forms";
import { ROLE_LABELS, ROLE_VALUES } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import type {
  BroadcastMode,
  BroadcastTargetsPreview,
} from "../../api/notifications/notifications.api";
import type { BroadcastBuilderState } from "../../hooks/notifications/broadcastBuilder.types";
import { BroadcastRecipientSummary } from "./BroadcastRecipientSummary.component";
import { BroadcastSegmentFields } from "./BroadcastSegmentFields.component";
import { BroadcastUserPicker } from "./BroadcastUserPicker.component";

interface BroadcastAudienceStepProps {
  state: BroadcastBuilderState;
  patch: (partial: Partial<BroadcastBuilderState>) => void;
  preview: BroadcastTargetsPreview | null;
  previewLoading: boolean;
  onLoadMoreSamples: () => void;
  sampleLoadingMore: boolean;
  error?: string | null;
  onNext: () => void;
}

const MODES: Array<{ id: BroadcastMode; label: string }> = [
  { id: "roles", label: "By Role" },
  { id: "users", label: "Specific Users" },
  { id: "user_segment", label: "Smart Segment" },
  { id: "vendor_segment", label: "Vendors" },
];

export function BroadcastAudienceStep({
  state,
  patch,
  preview,
  previewLoading,
  onLoadMoreSamples,
  sampleLoadingMore,
  error,
  onNext,
}: BroadcastAudienceStepProps) {
  const toggleRole = (role: string) => {
    const next = state.roles.includes(role)
      ? state.roles.filter((r) => r !== role)
      : [...state.roles, role];
    patch({ roles: next, allUsers: false });
  };

  const toggleExcludeRole = (role: string) => {
    patch({
      excludeRoles: state.excludeRoles.includes(role)
        ? state.excludeRoles.filter((r) => r !== role)
        : [...state.excludeRoles, role],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-line/80">
        <div className="lg:overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl border border-line bg-paper p-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => patch({ mode: m.id })}
                className={cn(
                  "h-9 rounded-lg px-2.5 text-xs font-medium transition-all cursor-pointer truncate",
                  state.mode === m.id
                    ? "bg-brand text-paper shadow-xs"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          {state.mode === "roles" && (
            <section className="rounded-xl border border-line/80 bg-paper/45 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Target Roles
                </span>
                <button
                  type="button"
                  onClick={() => patch({ allUsers: !state.allUsers })}
                  className={cn(
                    "h-7 rounded-full border px-3 text-xs font-medium cursor-pointer transition-colors",
                    state.allUsers
                      ? "border-brand bg-brand/15 text-brand"
                      : "border-line bg-surface text-ink-muted hover:text-ink",
                  )}
                >
                  {state.allUsers ? "✓ All Active Users" : "Target All Users"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ROLE_VALUES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={cn(
                      "h-8 rounded-lg border px-3 text-xs font-medium transition-colors cursor-pointer",
                      !state.allUsers && state.roles.includes(role)
                        ? "border-brand bg-brand/15 text-brand"
                        : "border-line bg-surface text-ink-muted hover:text-ink",
                    )}
                  >
                    {ROLE_LABELS[role]}
                  </button>
                ))}
              </div>
            </section>
          )}

          {state.mode === "users" && (
            <section className="rounded-xl border border-line/80 bg-paper/45 p-4 space-y-4">
              <FormFieldFrame
                label="Search & select users"
                htmlFor="user-picker"
              >
                <BroadcastUserPicker
                  placeholder="Search users by name or email..."
                  selected={state.selectedUsers}
                  onChange={(selectedUsers) => patch({ selectedUsers })}
                />
              </FormFieldFrame>
              <FormFieldFrame
                label="Or paste email addresses (comma or newline separated)"
                htmlFor="paste-emails"
              >
                <Textarea
                  id="paste-emails"
                  rows={3}
                  value={state.emailsText}
                  onChange={(e) => patch({ emailsText: e.target.value })}
                  placeholder="alice@example.com, bob@example.com"
                />
              </FormFieldFrame>
            </section>
          )}

          {(state.mode === "user_segment" ||
            state.mode === "vendor_segment") && (
            <section className="rounded-xl border border-line/80 bg-paper/45 p-4">
              <BroadcastSegmentFields
                mode={state.mode}
                state={state}
                patch={patch}
              />
            </section>
          )}

          <section className="rounded-xl border border-line/80 bg-paper/35 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Exclusions
              </span>
              <span className="text-[11px] font-mono text-ink-muted">
                {state.excludeUsers.length + state.excludeRoles.length} active
              </span>
            </div>
            <BroadcastUserPicker
              placeholder="Exclude specific users by name or email..."
              selected={state.excludeUsers}
              onChange={(excludeUsers) => patch({ excludeUsers })}
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ROLE_VALUES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleExcludeRole(role)}
                  className={cn(
                    "h-7 rounded-lg border px-2.5 text-[11px] font-medium cursor-pointer transition-colors",
                    state.excludeRoles.includes(role)
                      ? "border-danger/50 bg-danger/10 text-danger"
                      : "border-line bg-surface text-ink-muted hover:text-ink",
                  )}
                >
                  Exclude {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          </section>

          {error ? (
            <p role="alert" className="text-xs font-medium text-danger">
              {error}
            </p>
          ) : null}
        </div>

        <div className="lg:overflow-y-auto px-4 sm:px-6 py-5 bg-paper/20">
          <BroadcastRecipientSummary
            preview={preview}
            previewLoading={previewLoading}
            onLoadMore={onLoadMoreSamples}
            loadingMore={sampleLoadingMore}
          />
        </div>
      </div>

      <div className="border-t border-line/80 bg-surface px-4 sm:px-6 py-3.5 flex items-center justify-end shrink-0">
        <Button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto h-9 px-5"
        >
          <span>Continue to Message & Preview</span>
          <ArrowRight className="size-4 ml-1.5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

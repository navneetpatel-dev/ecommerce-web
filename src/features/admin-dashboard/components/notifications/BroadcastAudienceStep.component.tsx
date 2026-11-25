"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldFrame } from "@/shared/components/forms";
import { ROLE_LABELS, ROLE_VALUES } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import type {
  BroadcastMode,
  BroadcastTargetsPreview,
  BroadcastTargetUser,
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
  userSearchResults: BroadcastTargetUser[];
  onSearchUsers: (q: string) => void;
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
  userSearchResults,
  onSearchUsers,
  error,
  onNext,
}: BroadcastAudienceStepProps) {
  const [showExclusions, setShowExclusions] = useState(false);

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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-line bg-paper p-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => patch({ mode: m.id })}
            className={cn(
              "flex-1 min-w-[7rem] rounded-md px-3 py-1.5 text-body-xs font-medium transition-colors cursor-pointer",
              state.mode === m.id
                ? "bg-brand text-paper"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {state.mode === "roles" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-medium text-ink-muted">
              Select one or more roles
            </span>
            <button
              type="button"
              onClick={() => patch({ allUsers: !state.allUsers })}
              className={cn(
                "rounded-full border px-3 py-1 text-caption font-medium cursor-pointer transition-colors",
                state.allUsers
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-line text-ink-muted hover:text-ink",
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
                  "rounded-full border px-3 py-1 text-body-xs font-medium transition-colors cursor-pointer",
                  !state.allUsers && state.roles.includes(role)
                    ? "border-brand bg-brand/15 text-brand"
                    : "border-line bg-paper text-ink-muted hover:text-ink",
                )}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.mode === "users" && (
        <div className="space-y-3">
          <FormFieldFrame label="Search & select users" htmlFor="user-picker">
            <BroadcastUserPicker
              placeholder="Search users by name or email..."
              selected={state.selectedUsers}
              results={userSearchResults}
              onSearch={onSearchUsers}
              onChange={(selectedUsers) => patch({ selectedUsers })}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label="Or paste email addresses (comma or newline separated)"
            htmlFor="paste-emails"
          >
            <Textarea
              id="paste-emails"
              rows={2}
              value={state.emailsText}
              onChange={(e) => patch({ emailsText: e.target.value })}
              placeholder="alice@example.com, bob@example.com"
            />
          </FormFieldFrame>
        </div>
      )}

      {(state.mode === "user_segment" || state.mode === "vendor_segment") && (
        <BroadcastSegmentFields mode={state.mode} state={state} patch={patch} />
      )}

      <div className="border-t border-line/60 pt-2">
        <button
          type="button"
          onClick={() => setShowExclusions((p) => !p)}
          className="inline-flex items-center gap-1.5 text-caption font-medium text-ink-muted hover:text-ink cursor-pointer"
        >
          <ChevronRight
            className={cn(
              "size-3.5 transition-transform",
              showExclusions && "rotate-90",
            )}
          />
          Exclusions ({state.excludeUsers.length + state.excludeRoles.length})
        </button>
        {showExclusions && (
          <div className="mt-2.5 space-y-3 rounded-lg border border-line/60 bg-paper/40 p-3">
            <BroadcastUserPicker
              placeholder="Exclude specific users..."
              selected={state.excludeUsers}
              results={userSearchResults}
              onSearch={onSearchUsers}
              onChange={(excludeUsers) => patch({ excludeUsers })}
            />
            <div className="flex flex-wrap gap-1.5">
              {ROLE_VALUES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleExcludeRole(role)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] font-medium cursor-pointer",
                    state.excludeRoles.includes(role)
                      ? "border-danger/50 bg-danger/10 text-danger"
                      : "border-line text-ink-muted hover:text-ink",
                  )}
                >
                  Exclude {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <BroadcastRecipientSummary
        preview={preview}
        previewLoading={previewLoading}
      />

      {error ? (
        <p role="alert" className="text-body-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="button" onClick={onNext}>
          Next: Message & Delivery →
        </Button>
      </div>
    </div>
  );
}

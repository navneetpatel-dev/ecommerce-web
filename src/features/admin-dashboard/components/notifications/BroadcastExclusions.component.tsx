"use client";

import { ROLE_LABELS, ROLE_VALUES } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import type { BroadcastBuilderState } from "../../types/notifications/broadcastBuilder.types";
import { BroadcastUserPicker } from "./BroadcastUserPicker.component";

interface BroadcastExclusionsProps {
  state: BroadcastBuilderState;
  patch: (partial: Partial<BroadcastBuilderState>) => void;
}

/** People and roles left out of a broadcast. */
export function BroadcastExclusions({
  state,
  patch,
}: BroadcastExclusionsProps) {
  const toggleExcludeRole = (role: string) => {
    patch({
      excludeRoles: state.excludeRoles.includes(role)
        ? state.excludeRoles.filter((r) => r !== role)
        : [...state.excludeRoles, role],
    });
  };

  return (
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
  );
}

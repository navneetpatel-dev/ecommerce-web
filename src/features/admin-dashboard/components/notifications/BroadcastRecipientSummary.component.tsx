"use client";

import { Loader2, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { BroadcastTargetsPreview } from "../../api/notifications/notifications.api";

interface BroadcastRecipientSummaryProps {
  preview: BroadcastTargetsPreview | null;
  previewLoading: boolean;
  onLoadMore: () => void;
  loadingMore: boolean;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function BroadcastRecipientSummary({
  preview,
  previewLoading,
  onLoadMore,
  loadingMore,
}: BroadcastRecipientSummaryProps) {
  return (
    <div className="flex flex-col rounded-xl border border-line/80 bg-surface overflow-hidden h-full min-h-[20rem]">
      <div className="border-b border-line/80 px-4 py-3.5 space-y-3 bg-paper/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Users className="size-4 text-brand shrink-0" />
            <span>
              {previewLoading
                ? "Calculating recipients…"
                : "Audience Breakdown"}
            </span>
          </div>
          {!previewLoading && (
            <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-mono font-semibold text-brand">
              {preview?.total ?? 0} total
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-line/60 bg-surface px-3 py-2">
            <p className="text-[11px] text-ink-muted">Email</p>
            <p className="text-sm font-mono font-semibold text-ink">
              {preview?.emailEligible ?? 0}
            </p>
          </div>
          <div className="rounded-lg border border-line/60 bg-surface px-3 py-2">
            <p className="text-[11px] text-ink-muted">Web Push</p>
            <p className="text-sm font-mono font-semibold text-ink">
              {preview?.pushEligible ?? 0}
            </p>
          </div>
          <div className="rounded-lg border border-line/60 bg-surface px-3 py-2">
            <p className="text-[11px] text-ink-muted">In-App</p>
            <p className="text-sm font-mono font-semibold text-ink">
              {preview?.inAppEligible ?? 0}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-line/40 px-4">
        {!preview || preview.sampleRecipients.length === 0 ? (
          <p className="py-12 text-center text-xs text-ink-muted">
            {previewLoading
              ? "Loading matching recipients…"
              : "No matching recipients for the selected filters."}
          </p>
        ) : (
          preview.sampleRecipients.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 py-2.5 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-semibold text-brand">
                  {initials(u.name || u.email)}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-ink truncate">{u.name}</p>
                  <p className="text-[11px] text-ink-muted truncate">
                    {u.email}
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-ink-muted shrink-0 rounded-md bg-paper px-2 py-0.5 border border-line/60">
                {u.businessName || u.role}
              </span>
            </div>
          ))
        )}
      </div>

      {preview?.sampleHasMore && (
        <div className="border-t border-line/80 bg-paper/50 px-4 py-2 text-center">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={loadingMore}
            onClick={onLoadMore}
            className="h-8 text-xs"
          >
            {loadingMore && (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            )}
            Load more recipients
          </Button>
        </div>
      )}
    </div>
  );
}

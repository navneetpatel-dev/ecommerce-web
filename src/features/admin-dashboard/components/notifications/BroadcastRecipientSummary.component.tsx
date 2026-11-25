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

export function BroadcastRecipientSummary({
  preview,
  previewLoading,
  onLoadMore,
  loadingMore,
}: BroadcastRecipientSummaryProps) {
  return (
    <div className="flex flex-col rounded-xl border border-line bg-paper/50 overflow-hidden h-full min-h-[22rem]">
      <div className="border-b border-line bg-brand/10 px-4 py-3 space-y-1.5">
        <div className="flex items-center gap-2 text-body-sm">
          <Users className="size-4 text-brand shrink-0" />
          <span className="font-semibold text-ink">
            {previewLoading
              ? "Calculating recipients…"
              : `${preview?.total ?? 0} estimated recipients`}
          </span>
        </div>
        {preview && (
          <div className="flex flex-wrap gap-2 text-caption text-ink-muted">
            <span className="rounded-full bg-surface px-2.5 py-0.5 border border-line/60">
              Email:{" "}
              <strong className="text-ink">{preview.emailEligible}</strong>
            </span>
            <span className="rounded-full bg-surface px-2.5 py-0.5 border border-line/60">
              Web Push:{" "}
              <strong className="text-ink">{preview.pushEligible}</strong>
            </span>
            <span className="rounded-full bg-surface px-2.5 py-0.5 border border-line/60">
              In-App:{" "}
              <strong className="text-ink">{preview.inAppEligible}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-line/40 px-4 max-h-[24rem]">
        {!preview || preview.sampleRecipients.length === 0 ? (
          <p className="py-10 text-center text-body-xs text-ink-muted">
            {previewLoading
              ? "Loading matching recipients…"
              : "No matching recipients for current filters."}
          </p>
        ) : (
          preview.sampleRecipients.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 py-2.5 text-caption"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink truncate">{u.name}</p>
                <p className="text-ink-muted truncate">{u.email}</p>
              </div>
              <span className="font-mono text-[10px] text-ink-muted shrink-0 rounded bg-surface px-2 py-0.5 border border-line/60">
                {u.businessName || u.role}
              </span>
            </div>
          ))
        )}
      </div>

      {preview?.sampleHasMore && (
        <div className="border-t border-line bg-surface/60 px-4 py-2 text-center">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={loadingMore}
            onClick={onLoadMore}
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

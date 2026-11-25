"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import type { BroadcastTargetsPreview } from "../../api/notifications/notifications.api";

interface BroadcastRecipientSummaryProps {
  preview: BroadcastTargetsPreview | null;
  previewLoading: boolean;
}

export function BroadcastRecipientSummary({
  preview,
  previewLoading,
}: BroadcastRecipientSummaryProps) {
  const [showSampleList, setShowSampleList] = useState(false);

  return (
    <div className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-body-xs">
          <Users className="size-4 text-brand shrink-0" />
          <span className="font-semibold text-ink">
            {previewLoading
              ? "Calculating recipients…"
              : `Estimated recipients: ${preview?.total ?? 0} users`}
          </span>
          {preview && (
            <span className="text-ink-muted">
              ({preview.emailEligible} email · {preview.pushEligible} push ·{" "}
              {preview.inAppEligible} in-app)
            </span>
          )}
        </div>
        {preview && preview.sampleRecipients.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSampleList((p) => !p)}
            className="text-caption font-semibold text-brand hover:underline cursor-pointer"
          >
            {showSampleList ? "Hide list" : "Preview list"}
          </button>
        )}
      </div>
      {showSampleList && preview && (
        <div className="max-h-36 overflow-y-auto rounded-lg border border-line/60 bg-surface/90 divide-y divide-line/40 px-3">
          {preview.sampleRecipients.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between py-1.5 text-caption"
            >
              <span className="text-ink truncate">
                {u.name} <span className="text-ink-muted">({u.email})</span>
              </span>
              <span className="font-mono text-[10px] text-ink-muted">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

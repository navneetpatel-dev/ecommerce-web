"use client";

import { CalendarClock, ExternalLink, Link2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { isValidHttpUrl } from "@/shared/utils/validation/isValidHttpUrl";
import type { BroadcastBuilderState } from "../../types/notifications/broadcastBuilder.types";

interface BroadcastCtaScheduleFieldsProps {
  state: BroadcastBuilderState;
  patch: (partial: Partial<BroadcastBuilderState>) => void;
}

/** The optional action button of a broadcast, and sending it later. */
export function BroadcastCtaScheduleFields({
  state,
  patch,
}: BroadcastCtaScheduleFieldsProps) {
  const ctaUrlValid = isValidHttpUrl(state.ctaUrl);

  return (
    <div className="rounded-xl border border-line/70 bg-paper/40 p-3.5 space-y-3">
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <label className="inline-flex items-center gap-2 cursor-pointer text-ink font-medium">
          <input
            type="checkbox"
            checked={state.ctaEnabled}
            onChange={(e) => patch({ ctaEnabled: e.target.checked })}
          />
          <Link2 className="size-3.5 text-brand" />
          <span>Action button (CTA)</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer text-ink font-medium">
          <input
            type="checkbox"
            checked={state.scheduleEnabled}
            onChange={(e) => patch({ scheduleEnabled: e.target.checked })}
          />
          <CalendarClock className="size-3.5 text-brand" />
          <span>Schedule for later</span>
        </label>
      </div>

      {state.ctaEnabled && (
        <div className="space-y-1.5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Input
              className="h-9"
              value={state.ctaLabel}
              onChange={(e) => patch({ ctaLabel: e.target.value })}
              placeholder="Button label (e.g. Open Dashboard)"
              maxLength={80}
            />
            <div className="flex items-center gap-1.5">
              <Input
                className="h-9 flex-1"
                value={state.ctaUrl}
                onChange={(e) => patch({ ctaUrl: e.target.value })}
                placeholder="https://..."
                maxLength={500}
              />
              {ctaUrlValid && (
                <a
                  href={state.ctaUrl.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open pasted URL in new tab"
                  aria-label="Open pasted URL in new tab"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-brand hover:border-brand/50 hover:bg-brand/10 transition-colors"
                >
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              )}
            </div>
          </div>
          {state.ctaUrl.trim() && !ctaUrlValid && (
            <p className="text-[11px] text-danger">
              Enter a valid http:// or https:// URL to preview and test.
            </p>
          )}
        </div>
      )}

      {state.scheduleEnabled && (
        <Input
          type="datetime-local"
          className="h-9"
          value={state.scheduledAt}
          onChange={(e) => patch({ scheduledAt: e.target.value })}
        />
      )}
    </div>
  );
}

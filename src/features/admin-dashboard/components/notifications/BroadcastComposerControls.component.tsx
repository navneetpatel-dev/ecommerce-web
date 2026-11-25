"use client";

import { CalendarClock } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/dom/cn";
import type { BroadcastChannel } from "../../api/notifications/notifications.api";
import {
  BROADCAST_PRESETS,
  PERSONALIZATION_TOKENS,
  type BroadcastBuilderState,
} from "../../hooks/notifications/broadcastBuilder.types";

interface BroadcastComposerControlsProps {
  state: BroadcastBuilderState;
  patch: (partial: Partial<BroadcastBuilderState>) => void;
  onApplyPreset: (id: string) => void;
}

const CHANNELS: Array<{ id: BroadcastChannel; label: string }> = [
  { id: "EMAIL", label: "Email" },
  { id: "PUSH", label: "Web Push" },
  { id: "IN_APP", label: "In-App Inbox" },
];

export function BroadcastComposerControls({
  state,
  patch,
  onApplyPreset,
}: BroadcastComposerControlsProps) {
  const toggleChannel = (ch: BroadcastChannel) => {
    const next = state.channels.includes(ch)
      ? state.channels.filter((c) => c !== ch)
      : [...state.channels, ch];
    if (next.length > 0) patch({ channels: next });
  };

  return (
    <div className="space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => toggleChannel(ch.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-caption font-medium cursor-pointer transition-colors",
                state.channels.includes(ch.id)
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-line text-ink-muted hover:text-ink",
              )}
            >
              {state.channels.includes(ch.id) ? "✓ " : ""}
              {ch.label}
            </button>
          ))}
        </div>
        <Select onValueChange={onApplyPreset}>
          <SelectTrigger className="w-44 h-8 text-caption">
            <SelectValue placeholder="Load preset…" />
          </SelectTrigger>
          <SelectContent>
            {BROADCAST_PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <FormFieldFrame label="Classification" htmlFor="bc-class">
          <Select
            value={state.classification}
            onValueChange={(v) =>
              patch({ classification: v as "operational" | "marketing" })
            }
          >
            <SelectTrigger id="bc-class">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="marketing">Marketing (opt-in)</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame label="Priority" htmlFor="bc-prio">
          <Select
            value={state.priority}
            onValueChange={(v) => patch({ priority: v as "standard" | "high" })}
          >
            <SelectTrigger id="bc-prio">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard queue</SelectItem>
              <SelectItem value="high">High priority</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
      </div>

      <FormFieldFrame label="Subject" htmlFor="bc-subject">
        <Input
          id="bc-subject"
          value={state.subject}
          onChange={(e) => patch({ subject: e.target.value })}
          placeholder="e.g. Scheduled maintenance tonight"
          maxLength={200}
        />
      </FormFieldFrame>

      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] text-ink-muted mr-1">Insert:</span>
          {PERSONALIZATION_TOKENS.map((tok) => (
            <button
              key={tok}
              type="button"
              onClick={() => patch({ message: `${state.message}${tok}` })}
              className="rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-ink-muted hover:text-ink hover:border-brand/40 cursor-pointer"
            >
              {tok}
            </button>
          ))}
        </div>
        <FormFieldFrame label="Message" htmlFor="bc-message">
          <Textarea
            id="bc-message"
            rows={4}
            value={state.message}
            onChange={(e) => patch({ message: e.target.value })}
            placeholder="Write the message body shown to recipients…"
            maxLength={5000}
          />
        </FormFieldFrame>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-caption">
        <label className="inline-flex items-center gap-1.5 cursor-pointer text-ink">
          <input
            type="checkbox"
            checked={state.ctaEnabled}
            onChange={(e) => patch({ ctaEnabled: e.target.checked })}
          />
          Add CTA button
        </label>
        <label className="inline-flex items-center gap-1.5 cursor-pointer text-ink">
          <input
            type="checkbox"
            checked={state.scheduleEnabled}
            onChange={(e) => patch({ scheduleEnabled: e.target.checked })}
          />
          <CalendarClock className="size-3.5 text-brand" />
          Schedule for later
        </label>
      </div>

      {state.ctaEnabled && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Input
            value={state.ctaLabel}
            onChange={(e) => patch({ ctaLabel: e.target.value })}
            placeholder="Button label (e.g. View details)"
            maxLength={80}
          />
          <Input
            value={state.ctaUrl}
            onChange={(e) => patch({ ctaUrl: e.target.value })}
            placeholder="https://..."
            maxLength={500}
          />
        </div>
      )}

      {state.scheduleEnabled && (
        <Input
          type="datetime-local"
          value={state.scheduledAt}
          onChange={(e) => patch({ scheduledAt: e.target.value })}
        />
      )}
    </div>
  );
}

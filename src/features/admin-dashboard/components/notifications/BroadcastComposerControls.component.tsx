"use client";

import { useRef } from "react";
import { CalendarClock, ExternalLink, Link2 } from "lucide-react";
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

function isValidHttpUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function BroadcastComposerControls({
  state,
  patch,
  onApplyPreset,
}: BroadcastComposerControlsProps) {
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const activeFieldRef = useRef<"subject" | "message">("message");

  const toggleChannel = (ch: BroadcastChannel) => {
    const next = state.channels.includes(ch)
      ? state.channels.filter((c) => c !== ch)
      : [...state.channels, ch];
    if (next.length > 0) patch({ channels: next });
  };

  const insertToken = (tok: string) => {
    const target = activeFieldRef.current;
    const el = target === "subject" ? subjectRef.current : messageRef.current;
    const current = target === "subject" ? state.subject : state.message;

    if (el && document.activeElement === el) {
      const start = el.selectionStart ?? current.length;
      const end = el.selectionEnd ?? current.length;
      const nextValue = current.slice(0, start) + tok + current.slice(end);
      patch(
        target === "subject" ? { subject: nextValue } : { message: nextValue },
      );
      const nextCaret = start + tok.length;
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(nextCaret, nextCaret);
      });
      return;
    }

    patch({ message: `${state.message}${tok}` });
  };

  const ctaUrlValid = isValidHttpUrl(state.ctaUrl);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-1.5">
          {CHANNELS.map((ch) => {
            const active = state.channels.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => toggleChannel(ch.id)}
                className={cn(
                  "h-8 rounded-lg border px-3 text-xs font-medium cursor-pointer transition-colors",
                  active
                    ? "border-brand bg-brand/15 text-brand"
                    : "border-line bg-paper text-ink-muted hover:text-ink",
                )}
              >
                {active ? "✓ " : ""}
                {ch.label}
              </button>
            );
          })}
        </div>
        <Select onValueChange={onApplyPreset}>
          <SelectTrigger className="w-full sm:w-auto min-w-[14.5rem] h-8 text-xs whitespace-nowrap">
            <SelectValue placeholder="Load preset template" />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormFieldFrame label="Classification" htmlFor="bc-class">
          <Select
            value={state.classification}
            onValueChange={(v) =>
              patch({ classification: v as "operational" | "marketing" })
            }
          >
            <SelectTrigger id="bc-class" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operational">Operational (Service)</SelectItem>
              <SelectItem value="marketing">Marketing (Opt-in)</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame label="Queue priority" htmlFor="bc-prio">
          <Select
            value={state.priority}
            onValueChange={(v) => patch({ priority: v as "standard" | "high" })}
          >
            <SelectTrigger id="bc-prio" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (Batched)</SelectItem>
              <SelectItem value="high">High priority</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
      </div>

      <FormFieldFrame label="Subject" htmlFor="bc-subject">
        <Input
          ref={subjectRef}
          id="bc-subject"
          className="h-9"
          value={state.subject}
          onFocus={() => {
            activeFieldRef.current = "subject";
          }}
          onChange={(e) => patch({ subject: e.target.value })}
          placeholder="e.g. Scheduled platform maintenance tonight"
          maxLength={200}
        />
      </FormFieldFrame>

      <div className="space-y-2">
        <FormFieldFrame label="Message body" htmlFor="bc-message">
          <Textarea
            ref={messageRef}
            id="bc-message"
            rows={6}
            value={state.message}
            onFocus={() => {
              activeFieldRef.current = "message";
            }}
            onChange={(e) => patch({ message: e.target.value })}
            placeholder="Write the message body shown to recipients…"
            maxLength={5000}
            className="min-h-[8.5rem]"
          />
        </FormFieldFrame>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-ink-muted mr-0.5">Variables:</span>
          {PERSONALIZATION_TOKENS.map((tok) => (
            <button
              key={tok}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertToken(tok)}
              className="h-6 rounded-md border border-line bg-paper px-2 font-mono text-[10px] text-ink-muted hover:text-ink hover:border-brand/40 cursor-pointer transition-colors"
            >
              {tok}
            </button>
          ))}
        </div>
      </div>

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
    </div>
  );
}

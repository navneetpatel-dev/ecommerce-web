"use client";

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
} from "../../constants/notifications/broadcastPresets";
import type { BroadcastBuilderState } from "../../types/notifications/broadcastBuilder.types";
import { useBroadcastTokenInsert } from "../../hooks/notifications/useBroadcastTokenInsert.hook";
import { BroadcastCtaScheduleFields } from "./BroadcastCtaScheduleFields.component";

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
  const { subjectRef, messageRef, focusSubject, focusMessage, insertToken } =
    useBroadcastTokenInsert(state, patch);

  const toggleChannel = (ch: BroadcastChannel) => {
    const next = state.channels.includes(ch)
      ? state.channels.filter((c) => c !== ch)
      : [...state.channels, ch];
    if (next.length > 0) patch({ channels: next });
  };

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
          onFocus={focusSubject}
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
            onFocus={focusMessage}
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

      <BroadcastCtaScheduleFields state={state} patch={patch} />
    </div>
  );
}

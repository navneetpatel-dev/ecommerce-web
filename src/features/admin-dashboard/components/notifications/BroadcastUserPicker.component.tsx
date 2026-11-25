"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import type { BroadcastTargetUser } from "../../api/notifications/notifications.api";

interface BroadcastUserPickerProps {
  placeholder: string;
  selected: BroadcastTargetUser[];
  results: BroadcastTargetUser[];
  onSearch: (q: string) => void;
  onChange: (next: BroadcastTargetUser[]) => void;
}

export function BroadcastUserPicker({
  placeholder,
  selected,
  results,
  onSearch,
  onChange,
}: BroadcastUserPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selectedIds = new Set(selected.map((u) => u.id));
  const available = results.filter((u) => !selectedIds.has(u.id));

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-muted" />
        <Input
          value={query}
          onFocus={() => {
            setOpen(true);
            onSearch(query);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="pl-8"
        />
        {open && available.length > 0 && (
          <div className="absolute z-30 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-line bg-surface shadow-lg divide-y divide-line/40">
            {available.map((user) => (
              <button
                key={user.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange([...selected, user]);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-body-xs hover:bg-surface-muted cursor-pointer"
              >
                <span className="truncate font-medium text-ink">
                  {user.name}{" "}
                  <span className="text-ink-muted font-normal">
                    ({user.email})
                  </span>
                </span>
                <span className="text-[10px] font-mono text-ink-muted shrink-0">
                  {user.role}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((u) => (
            <span
              key={u.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-body-xs text-ink"
            >
              <span>{u.name}</span>
              <span className="text-ink-muted text-[11px]">{u.email}</span>
              <button
                type="button"
                onClick={() =>
                  onChange(selected.filter((item) => item.id !== u.id))
                }
                aria-label={`Remove ${u.name}`}
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

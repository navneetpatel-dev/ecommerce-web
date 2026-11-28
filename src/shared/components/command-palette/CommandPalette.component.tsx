"use client";

import { Search } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { useCommandPalette } from "../../hooks/command-palette/useCommandPalette.hook";

export type { CommandItem } from "../../types/command-palette/types";

export function CommandPalette() {
  const {
    open,
    setOpen,
    query,
    handleQueryChange,
    filtered,
    selectedIndex,
    setSelectedIndex,
    executeCommand,
  } = useCommandPalette();

  if (!open) return null;

  return (
    // Backdrop click is a pointer convenience; Escape is handled via the key listener.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- only stops propagation to the backdrop */}
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-elevation-3 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="size-5 text-ink-muted shrink-0" aria-hidden />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-body font-normal text-ink outline-none placeholder:text-ink-muted"
            aria-label="Search commands"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center justify-center rounded border border-line bg-surface-muted px-1.5 font-mono text-[10px] text-ink-muted">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-body-sm text-ink-muted">
              No matching commands or pages found.
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;

              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-body-sm transition-colors",
                    isSelected
                      ? "bg-brand/10 text-brand font-medium"
                      : "text-ink hover:bg-surface-muted",
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-lg border",
                        isSelected
                          ? "border-brand/30 bg-brand/10 text-brand"
                          : "border-line bg-surface text-ink-muted",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="truncate">{cmd.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-ink-muted/70 shrink-0">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between border-t border-line bg-surface-muted/40 px-4 py-2 text-[11px] text-ink-muted">
          <span>
            Navigate with <kbd className="font-mono">↑</kbd>{" "}
            <kbd className="font-mono">↓</kbd>
          </span>
          <span>
            Select with <kbd className="font-mono">↵</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}

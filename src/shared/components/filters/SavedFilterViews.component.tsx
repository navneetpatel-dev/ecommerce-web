"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check, Plus, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/utils/dom/cn";

export interface SavedFilterViewItem {
  id: string;
  name: string;
  values: Record<string, unknown>;
  createdAt: number;
}

export interface SavedFilterViewsProps {
  storageKey: string;
  currentValues: Record<string, unknown>;
  defaultValues?: Record<string, unknown>;
  onApplyView: (values: Record<string, unknown>) => void;
  onShare?: (url: string) => void;
  className?: string;
}

function areValuesEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean {
  const keysA = Object.keys(a).filter(
    (k) => a[k] !== "" && a[k] !== undefined && a[k] !== null,
  );
  const keysB = Object.keys(b).filter(
    (k) => b[k] !== "" && b[k] !== undefined && b[k] !== null,
  );

  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => String(a[k]) === String(b[k]));
}

export function SavedFilterViews({
  storageKey,
  currentValues,
  defaultValues = {},
  onApplyView,
  onShare,
  className,
}: SavedFilterViewsProps) {
  const [views, setViews] = useState<SavedFilterViewItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const fullStorageKey = `saved-filter-views:${storageKey}`;

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(fullStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setViews(parsed);
        }
      }
    } catch {
      // Storage unavailable or corrupted
    }
  }, [fullStorageKey]);

  const saveToStorage = (updatedViews: SavedFilterViewItem[]) => {
    setViews(updatedViews);
    try {
      localStorage.setItem(fullStorageKey, JSON.stringify(updatedViews));
    } catch {
      // Storage full or unavailable
    }
  };

  const handleSaveCurrentView = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newViewName.trim();
    if (!trimmed) return;

    const newView: SavedFilterViewItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmed,
      values: { ...currentValues },
      createdAt: Date.now(),
    };

    const updated = [...views, newView];
    saveToStorage(updated);
    setNewViewName("");
    setIsSaving(false);
  };

  const handleDeleteView = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = views.filter((v) => v.id !== id);
    saveToStorage(updated);
  };

  const handleShareView = async () => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      Object.entries(currentValues).forEach(([key, val]) => {
        if (val !== "" && val !== undefined && val !== null) {
          url.searchParams.set(key, String(val));
        } else {
          url.searchParams.delete(key);
        }
      });
      const shareableUrl = url.toString();

      if (onShare) {
        onShare(shareableUrl);
      } else if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareableUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Storage or clipboard unavailable
    }
  };

  const isDefaultActive = areValuesEqual(currentValues, defaultValues);

  return (
    <div
      role="region"
      aria-label="Saved filter views"
      className={cn(
        "inline-flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5",
        className,
      )}
    >
      <div className="inline-flex items-center rounded-lg p-0.5 bg-surface-muted/60 border border-line/60">
        {/* Default View Tab */}
        <button
          type="button"
          onClick={() => onApplyView(defaultValues)}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium transition-all select-none",
            isDefaultActive
              ? "bg-surface text-ink font-semibold shadow-2xs"
              : "text-ink-muted hover:text-ink",
          )}
        >
          <Bookmark className="size-3 text-ink-muted" aria-hidden />
          <span>Default</span>
        </button>

        {/* Custom Saved Views */}
        {views.map((view) => {
          const isActive = areValuesEqual(currentValues, view.values);
          return (
            <div
              key={view.id}
              className={cn(
                "group inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium transition-all select-none",
                isActive
                  ? "bg-surface text-brand font-semibold shadow-2xs"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              <button
                type="button"
                onClick={() => onApplyView(view.values)}
                className="text-left select-none focus:outline-none"
              >
                {view.name}
              </button>
              <button
                type="button"
                onClick={(e) => handleDeleteView(view.id, e)}
                className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity ml-1 p-0.5 rounded"
                aria-label={`Delete view ${view.name}`}
                title="Delete view"
              >
                <Trash2 className="size-3" aria-hidden />
              </button>
            </div>
          );
        })}
      </div>

      {/* Save & Share Actions */}
      <div className="inline-flex items-center gap-0.5">
        <Popover open={isSaving} onOpenChange={setIsSaving}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 gap-1 px-2 text-caption text-ink-muted hover:text-ink"
              aria-label="Save current filter view"
            >
              <Plus className="size-3" aria-hidden />
              <span>Save view</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={4}
            className="w-64 p-3 space-y-2.5 z-50 bg-surface-raised border-line shadow-elevation-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-body-sm font-semibold text-ink">
                Save Filter View
              </p>
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="text-ink-muted hover:text-ink"
                aria-label="Close"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
            <form onSubmit={handleSaveCurrentView} className="space-y-2">
              <Input
                type="text"
                autoFocus
                placeholder="e.g. Urgent or Processing"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                className="h-8 text-body-sm"
                aria-label="View name"
              />
              <div className="flex justify-end gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsSaving(false)}
                  className="h-7 text-caption"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="default"
                  disabled={!newViewName.trim()}
                  className="h-7 text-caption"
                >
                  Save
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>

        {/* Share View Link Button */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleShareView}
          className="h-7 gap-1 px-2 text-caption text-ink-muted hover:text-ink"
          aria-label="Share current filter view link"
          title="Copy shareable link with current filters"
        >
          {copiedLink ? (
            <>
              <Check className="size-3 text-emerald-500" aria-hidden />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Link copied!
              </span>
            </>
          ) : (
            <>
              <Share2 className="size-3" aria-hidden />
              <span>Share</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

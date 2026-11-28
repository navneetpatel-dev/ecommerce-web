"use client";

import { Bookmark, Check, Share2, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";
import { useSavedFilterViews } from "../../hooks/filters/useSavedFilterViews.hook";
import { areFilterValuesEqual as areValuesEqual } from "../../utils/filters/areFilterValuesEqual";
import { SaveViewPopover } from "./SaveViewPopover.component";

export type { SavedFilterViewItem } from "../../types/filters/savedFilterViews.types";

export interface SavedFilterViewsProps {
  storageKey: string;
  currentValues: Record<string, unknown>;
  defaultValues?: Record<string, unknown>;
  onApplyView: (values: Record<string, unknown>) => void;
  onShare?: (url: string) => void;
  className?: string;
}

export function SavedFilterViews({
  storageKey,
  currentValues,
  defaultValues = {},
  onApplyView,
  onShare,
  className,
}: SavedFilterViewsProps) {
  const {
    views,
    isSaving,
    setIsSaving,
    newViewName,
    setNewViewName,
    copiedLink,
    handleSaveCurrentView,
    handleDeleteView,
    handleShareView,
  } = useSavedFilterViews({ storageKey, currentValues, onShare });

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
        <SaveViewPopover
          open={isSaving}
          onOpenChange={setIsSaving}
          name={newViewName}
          onNameChange={setNewViewName}
          onSubmit={handleSaveCurrentView}
        />

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

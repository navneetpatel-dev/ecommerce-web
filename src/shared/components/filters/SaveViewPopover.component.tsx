"use client";

import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { IconCloseButton } from "@/shared/components/ui/icon-close-button";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

interface SaveViewPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: (event: FormEvent) => void;
}

/** Names the current filters so they can be applied again. */
export function SaveViewPopover({
  open,
  onOpenChange,
  name,
  onNameChange,
  onSubmit,
}: SaveViewPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
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
          <IconCloseButton
            variant="inline"
            onClick={() => onOpenChange(false)}
          />
        </div>
        <form onSubmit={onSubmit} className="space-y-2">
          <Input
            type="text"
            autoFocus
            placeholder="e.g. Urgent or Processing"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-8 text-body-sm"
            aria-label="View name"
          />
          <div className="flex justify-end gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-7 text-caption"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="default"
              disabled={!name.trim()}
              className="h-7 text-caption"
            >
              Save
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

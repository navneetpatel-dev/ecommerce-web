"use client";

import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import type { SavedFilterViewItem } from "../../types/filters/savedFilterViews.types";

interface UseSavedFilterViewsParams {
  storageKey: string;
  currentValues: Record<string, unknown>;
  onShare?: (url: string) => void;
}

/** Named filter sets kept on this device, and a link to the current filters. */
export function useSavedFilterViews({
  storageKey,
  currentValues,
  onShare,
}: UseSavedFilterViewsParams) {
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

  const handleSaveCurrentView = (e: FormEvent) => {
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

  const handleDeleteView = (id: string, e: MouseEvent) => {
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

  return {
    views,
    isSaving,
    setIsSaving,
    newViewName,
    setNewViewName,
    copiedLink,
    handleSaveCurrentView,
    handleDeleteView,
    handleShareView,
  };
}

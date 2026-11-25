"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

export interface InfiniteSearchSelectProps<T> {
  placeholder: string;
  loadPage: (
    q: string,
    page: number,
  ) => Promise<{ items: T[]; hasMore: boolean }>;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string | undefined;
  selected: T[];
  multiple?: boolean;
  onChange: (next: T[]) => void;
}

export function InfiniteSearchSelect<T>({
  placeholder,
  loadPage,
  getId,
  getLabel,
  getSubLabel,
  selected,
  multiple = true,
  onChange,
}: InfiniteSearchSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(
    async (q: string, targetPage: number, append: boolean) => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await loadPage(q, targetPage);
        setItems((prev) => (append ? [...prev, ...res.items] : res.items));
        setHasMore(res.hasMore);
        setPage(targetPage);
      } catch {
        setLoadError("Failed to load options.");
      } finally {
        setLoading(false);
      }
    },
    [loadPage],
  );

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => void fetchPage(query, 1, false), 250);
    return () => clearTimeout(t);
  }, [open, query, fetchPage]);

  useEffect(() => {
    if (!open || !hasMore || loading) return;
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !loading && hasMore) {
        void fetchPage(query, page + 1, true);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, hasMore, loading, query, page, fetchPage]);

  const selectedIds = new Set(selected.map(getId));
  const visibleItems = items.filter((it) => !selectedIds.has(getId(it)));

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-muted" />
        <Input
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="pl-8"
        />

        {open && (
          <div className="absolute z-40 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-line bg-surface shadow-xl divide-y divide-line/40">
            {loadError ? (
              <p className="px-3 py-2.5 text-caption text-danger">
                {loadError}
              </p>
            ) : visibleItems.length === 0 && !loading ? (
              <p className="px-3 py-3 text-caption text-ink-muted">
                No matching options.
              </p>
            ) : (
              visibleItems.map((item) => {
                const sub = getSubLabel?.(item);
                return (
                  <button
                    key={getId(item)}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange(multiple ? [...selected, item] : [item]);
                      setQuery("");
                      if (!multiple) setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-body-xs hover:bg-surface-muted cursor-pointer"
                  >
                    <span className="truncate font-medium text-ink">
                      {getLabel(item)}
                    </span>
                    {sub ? (
                      <span className="text-[11px] font-mono text-ink-muted shrink-0">
                        {sub}
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
            <div ref={sentinelRef} className="h-1" />
            {loading && (
              <div className="flex items-center justify-center gap-1.5 py-2 text-caption text-ink-muted">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Loading…</span>
              </div>
            )}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((item) => (
            <span
              key={getId(item)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-body-xs text-ink"
            >
              <span>{getLabel(item)}</span>
              <button
                type="button"
                onClick={() =>
                  onChange(selected.filter((x) => getId(x) !== getId(item)))
                }
                aria-label={`Remove ${getLabel(item)}`}
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

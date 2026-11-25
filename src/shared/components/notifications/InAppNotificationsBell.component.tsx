"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import { cn } from "@/shared/utils/dom/cn";

export interface InAppNotificationItem {
  id: string;
  title: string;
  message: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export function InAppNotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<InAppNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiClient.get<{
        items: InAppNotificationItem[];
        unreadCount: number;
      }>(API.notifications.inApp);
      setItems(res.items ?? []);
      setUnreadCount(res.unreadCount ?? 0);
    } catch {
      // Ignore transient polling failures
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const markRead = async (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isRead: true } : it)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await apiClient.patch(API.notifications.inAppRead(id), {});
    } catch {
      void load();
    }
  };

  const markAllRead = async () => {
    setItems((prev) => prev.map((it) => ({ ...it, isRead: true })));
    setUnreadCount(0);
    try {
      await apiClient.post(API.notifications.inAppReadAll, {});
    } catch {
      void load();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((p) => !p);
          void load();
        }}
        aria-label="Notifications"
        className="relative inline-flex size-9 items-center justify-center rounded-full border border-line bg-surface text-ink-muted hover:text-ink hover:border-line-strong transition-colors cursor-pointer"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 h-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-paper">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-xl border border-line bg-surface shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="text-body-sm font-semibold text-ink">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-caption font-medium text-brand hover:underline cursor-pointer"
              >
                <CheckCheck className="size-3.5" aria-hidden="true" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-line/50">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-body-xs text-ink-muted">
                No notifications yet.
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "px-4 py-3 space-y-1 transition-colors hover:bg-surface-muted/50",
                    !item.isRead && "bg-brand/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-body-xs font-semibold text-ink">
                      {item.title}
                    </p>
                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={() => void markRead(item.id)}
                        aria-label="Mark as read"
                        title="Mark as read"
                        className="mt-0.5 size-2.5 rounded-full bg-brand shrink-0 cursor-pointer"
                      />
                    )}
                  </div>
                  <p className="text-caption text-ink-muted whitespace-pre-line line-clamp-3">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-ink-muted/80">
                      {formatDateTime(item.createdAt)}
                    </span>
                    {item.ctaUrl && (
                      <Link
                        href={item.ctaUrl}
                        onClick={() => {
                          if (!item.isRead) void markRead(item.id);
                          setOpen(false);
                        }}
                        className="text-caption font-medium text-brand hover:underline"
                      >
                        {item.ctaLabel || "View"} →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

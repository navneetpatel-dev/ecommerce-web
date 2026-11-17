"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Boxes,
  Bug,
  Headphones,
  LifeBuoy,
  Moon,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Sun,
  Ticket,
  Truck,
  Users,
} from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { useThemePalette } from "@/shared/hooks/theme/useThemePalette.hook";

export interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Actions" | "System";
  icon: typeof Search;
  shortcut?: string;
  path?: string;
  perform?: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { mode, toggleMode } = useThemePalette();

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-orders",
        title: "Orders Management",
        category: "Navigation",
        icon: ShoppingBag,
        path: "/admin/orders",
      },
      {
        id: "nav-users",
        title: "Users & Customers",
        category: "Navigation",
        icon: Users,
        path: "/admin/users",
      },
      {
        id: "nav-products",
        title: "Products & Moderation",
        category: "Navigation",
        icon: Package,
        path: "/admin/products",
      },
      {
        id: "nav-shipping",
        title: "Shipping & RTO Operations",
        category: "Navigation",
        icon: Truck,
        path: "/admin/shipping",
      },
      {
        id: "nav-tickets",
        title: "Support Tickets",
        category: "Navigation",
        icon: Headphones,
        path: "/support/tickets",
      },
      {
        id: "nav-bugs",
        title: "Bug Reports",
        category: "Navigation",
        icon: Bug,
        path: "/bug-reports",
      },
      {
        id: "nav-coupons",
        title: "Coupons & Discounts",
        category: "Navigation",
        icon: Ticket,
        path: "/admin/coupons",
      },
      {
        id: "nav-categories",
        title: "Categories Management",
        category: "Navigation",
        icon: Boxes,
        path: "/admin/categories",
      },
      {
        id: "action-new-ticket",
        title: "Create Support Ticket",
        category: "Quick Actions",
        icon: Plus,
        path: "/support/tickets/new",
      },
      {
        id: "action-new-product",
        title: "Add New Product",
        category: "Quick Actions",
        icon: Plus,
        path: "/vendor/products/new",
      },
      {
        id: "action-toggle-theme",
        title: `Switch to ${mode === "dark" ? "Light" : "Dark"} Mode`,
        category: "System",
        icon: mode === "dark" ? Sun : Moon,
        perform: () => toggleMode?.(),
      },
      {
        id: "action-help",
        title: "Help & Documentation",
        category: "System",
        icon: LifeBuoy,
        path: "/help",
      },
    ],
    [mode, toggleMode],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        cmd.path?.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Global hotkey: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Keyboard navigation within list
  useEffect(() => {
    if (!open) return;

    const handleListKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          executeCommand(selected);
        }
      }
    };

    window.addEventListener("keydown", handleListKeys);
    return () => window.removeEventListener("keydown", handleListKeys);
  }, [open, filtered, selectedIndex]);

  const executeCommand = (cmd: CommandItem) => {
    setOpen(false);
    if (cmd.perform) {
      cmd.perform();
    } else if (cmd.path) {
      router.push(cmd.path);
    }
  };

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
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
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

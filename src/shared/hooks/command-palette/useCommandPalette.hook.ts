"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CommandItem } from "../../types/command-palette/types";
import { useCommandPaletteCommands } from "./useCommandPaletteCommands.hook";

/** Opening the palette with Cmd/Ctrl+K, searching it and running a command by keyboard. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const commands = useCommandPaletteCommands();

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

  const executeCommand = useCallback(
    (cmd: CommandItem) => {
      setOpen(false);
      if (cmd.perform) {
        cmd.perform();
      } else if (cmd.path) {
        router.push(cmd.path);
      }
    },
    [router],
  );

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
  }, [open, filtered, selectedIndex, executeCommand]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(0);
  };

  return {
    open,
    setOpen,
    query,
    handleQueryChange,
    filtered,
    selectedIndex,
    setSelectedIndex,
    executeCommand,
  };
}

import type { Search } from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Actions" | "System";
  icon: typeof Search;
  shortcut?: string;
  path?: string;
  perform?: () => void;
}

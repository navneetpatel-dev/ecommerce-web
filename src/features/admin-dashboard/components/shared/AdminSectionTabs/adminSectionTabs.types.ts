import type { ReactNode } from "react";

export type AdminSectionTabItem = {
  value: string;
  label: string;
  count?: number;
  content: ReactNode;
};

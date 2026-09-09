import { reportPanelStyles } from "../../shared/reportPanel.styles";

export const adminCashbackWriteOffPanelStyles = {
  ...reportPanelStyles,
  filterGrid: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4 items-end",
  buttonGroup: "sm:col-span-2 xl:col-span-4 flex-wrap items-center gap-2 pt-1",
} as const;

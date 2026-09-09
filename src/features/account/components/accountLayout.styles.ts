import { cn } from "@/shared/utils/cn";

export const accountLayoutStyles = {
  root: (isWorkspace: boolean) =>
    cn("relative", isWorkspace ? "min-w-0" : undefined),
  ambientGradient:
    "pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_8%,transparent),transparent_60%)]",
  content: (isWorkspace: boolean) =>
    cn(
      "relative",
      isWorkspace ? "w-full min-w-0" : "storefront-container py-6 md:py-8",
    ),
  header: (isWorkspace: boolean) => cn(isWorkspace ? "mb-6" : "mb-8"),
  title:
    "mt-1.5 font-display text-ink leading-[1.1] tracking-tight [font-size:var(--text-display-sm)]",
  hint: "mt-2 max-w-xl text-body text-ink-muted",
  mobileNavContainer:
    "scrollbar-none mb-6 -mx-1 overflow-x-auto overscroll-x-contain pb-1 lg:hidden",
  mobileNavList: "flex min-w-max gap-1 px-1",
  mobileNavButton: (selected: boolean) =>
    cn(
      "h-auto min-h-0 max-h-none gap-2 px-3.5 py-2 text-body-sm",
      selected
        ? "border-line-strong bg-paper text-brand shadow-[inset_0_-2px_0_0_var(--brand)] hover:bg-paper hover:text-brand"
        : "border-line text-ink-muted hover:border-ink/25 hover:text-ink",
    ),
  layoutGrid: "grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10",
  desktopAside: "hidden lg:block",
  desktopNav:
    "sticky top-24 isolate border border-line bg-paper shadow-elevation-1",
  desktopNavList: "divide-y divide-line",
  desktopNavButton: (selected: boolean) =>
    cn(
      "h-auto min-h-0 max-h-none w-full items-start gap-3 rounded-none px-4 py-3.5 text-left font-normal",
      selected
        ? "bg-paper shadow-[inset_3px_0_0_0_var(--brand)] hover:bg-paper"
        : "hover:bg-paper/70",
    ),
  desktopNavIcon: (selected: boolean) =>
    cn("mt-0.5 shrink-0", selected ? "text-brand" : "text-ink-muted"),
  desktopNavLabel: (selected: boolean) =>
    cn(
      "block text-[0.875rem] font-medium",
      selected ? "text-ink" : "text-ink-muted",
    ),
  desktopNavDescription:
    "mt-0.5 block text-[0.75rem] leading-snug text-ink-faint",
  mainColumn: "min-w-0",
  mobileActiveHeader: "mb-5 lg:hidden",
  mobileActiveDescription: "mt-1 text-[0.875rem] text-ink-muted",
} as const;

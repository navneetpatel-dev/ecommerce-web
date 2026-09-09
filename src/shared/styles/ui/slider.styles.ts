export const sliderStyles = {
  root: "relative flex w-full touch-none select-none items-center",
  track: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-line",
  range: "absolute h-full bg-brand",
  thumb:
    "block h-5 w-5 cursor-pointer rounded-full border-2 border-brand bg-surface outline-none ring-offset-background transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50",
} as const;

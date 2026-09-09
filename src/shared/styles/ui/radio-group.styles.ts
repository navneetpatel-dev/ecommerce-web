export const radioGroupStyles = {
  root: "grid gap-2",
  item: "h-5 w-5 cursor-pointer rounded-full border-2 border-line bg-surface outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand",
  indicator: "flex items-center justify-center",
  dot: "h-2.5 w-2.5 rounded-full bg-brand",
} as const;

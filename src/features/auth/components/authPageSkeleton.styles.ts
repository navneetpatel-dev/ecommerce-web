export const authPageSkeletonStyles = {
  card: "relative overflow-hidden rounded-xl border border-line/90 bg-surface/95 shadow-elevation-3 ring-1 ring-inset ring-white/[0.04] backdrop-blur-sm",
  header:
    "space-y-3 border-b border-line/80 bg-gradient-to-b from-paper/55 to-paper/25 px-5 py-5 sm:px-8 sm:py-8",
  headerTitle: "h-8 w-48 sm:h-9 sm:w-56",
  headerSubtitle: "h-4 w-full max-w-[16rem]",
  body: "space-y-5 px-5 py-5 sm:px-8 sm:py-8",
  fieldGroup: "space-y-2",
  label: "h-3.5 w-16",
  labelWide: "h-3.5 w-20",
  input: "h-11 w-full",
  dividerRow: "flex items-center gap-3 pt-1",
  dividerLine: "h-px flex-1",
  dividerText: "h-3 w-24",
  footer: "border-t border-line/80 bg-paper/30 px-5 py-4 sm:px-8 sm:py-5",
  footerText: "mx-auto h-4 w-48",
} as const;

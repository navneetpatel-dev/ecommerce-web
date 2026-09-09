export const heroSectionStyles = {
  section:
    "relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset",
  srOnly: "sr-only",
  slideWrapper: "relative min-h-[min(78vh,640px)] md:min-h-[min(82vh,720px)]",
  contentContainer:
    "storefront-container relative z-10 flex h-full min-h-[min(78vh,640px)] flex-col justify-end pb-24 pt-16 md:min-h-[min(82vh,720px)] md:justify-center md:pb-24 md:pt-20",
  motionContainer: "absolute inset-0 will-change-transform",
  innerOverflow: "absolute inset-0 overflow-hidden",
  motionImage: "absolute inset-0",
  mediaCover: "object-cover",
  mediaInset: "absolute inset-0",
  gradientHorizontal:
    "absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25",
  gradientVertical:
    "absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20",
  iconButton:
    "rounded-full border-white/40 bg-black/55 text-white shadow-elevation-2 backdrop-blur-md hover:border-white/70 hover:bg-black/70 hover:text-white",
  desktopControls:
    "pointer-events-none absolute inset-y-0 right-0 z-20 hidden items-center pr-4 md:flex lg:pr-8",
  desktopGroup: "pointer-events-auto flex flex-col gap-2",
  mobilePrev: "absolute bottom-5 left-3 z-20 md:hidden",
  mobileNext: "absolute bottom-5 right-3 z-20 md:hidden",
  copyContainer: "max-w-xl",
  eyebrow:
    "text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70",
  headline: "mt-3 font-display leading-[1.05] text-white",
  subheadline: "mt-4 max-w-md text-body-lg text-white/80",
  ctaGroup: "mt-8 flex flex-wrap items-center gap-3",
  primaryCta:
    "inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-body font-medium tracking-tight text-neutral-950 transition-[transform,background-color] duration-200 hover:bg-white/92 active:scale-[0.98]",
  secondaryCta:
    "inline-flex h-12 items-center rounded-full border border-white/35 px-7 text-body font-medium tracking-tight text-white bg-white/5 backdrop-blur-sm transition-[transform,background-color,border-color] duration-200 hover:border-white/55 hover:bg-white/12 active:scale-[0.98]",
} as const;

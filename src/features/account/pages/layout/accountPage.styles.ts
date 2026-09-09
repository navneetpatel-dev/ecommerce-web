export const accountPageStyles = {
  signInRoot: "relative",
  signInGlow:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  signInContainer: "storefront-container relative py-16 md:py-20",
  registerRow: "mt-4 flex justify-center",
  fallbackContainer: "storefront-container space-y-4 py-8",
  fallbackSkeletonSmall: "h-4 w-24",
  fallbackSkeletonMedium: "h-10 w-48",
  fallbackSkeletonLarge: "mt-6 h-64 w-full",
} as const;

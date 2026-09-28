export const storefrontLayoutStyles = {
  container: "min-h-screen bg-paper flex flex-col",
  /** Bottom padding clears the mobile tab bar plus the iOS home indicator. */
  main: "flex-1 min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-72px)] pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0",
} as const;

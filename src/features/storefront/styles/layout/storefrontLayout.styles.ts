import { CONTENT_CLEARANCE_CLASS } from "@/shared/constants/layout/mobileRails";

export const storefrontLayoutStyles = {
  container: "min-h-[100dvh] bg-paper flex flex-col",
  /** Bottom padding clears the mobile tab bar plus the iOS home indicator. */
  main: `flex-1 min-h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-72px)] ${CONTENT_CLEARANCE_CLASS} lg:pb-0`,
} as const;

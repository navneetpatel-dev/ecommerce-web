import { CONTENT_CLEARANCE_CLASS } from "@/shared/constants/layout/mobileRails";

export const storefrontLayoutStyles = {
  container: "min-h-[100dvh] bg-paper flex flex-col",
  /**
   * Bottom padding clears the mobile tab bar plus the iOS home indicator;
   * `outline-none` hides the focus ring when the skip link/route announcer
   * moves focus here.
   */
  main: `flex-1 min-h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-72px)] ${CONTENT_CLEARANCE_CLASS} outline-none lg:pb-0`,
} as const;

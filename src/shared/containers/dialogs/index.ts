/**
 * Dialog containers, aliased for their consumer-facing names. The sheet that
 * every listing/filter surface mounts is the *container* (it owns overlay
 * state), so it is exported from here rather than from `components/`.
 */
export { BottomSheetContainer as BottomSheet } from "./BottomSheetContainer.container";
export { CookieBannerContainer as CookieBanner } from "./CookieBannerContainer.container";
export { LoginRequiredDialogContainer as LoginRequiredDialog } from "./LoginRequiredDialogContainer.container";

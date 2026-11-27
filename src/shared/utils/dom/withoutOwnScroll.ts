const OWN_SCROLL_CLASS = /^(?:[a-z]+:)*overflow(?:-y)?-(?:auto|scroll)$/;

/**
 * The dialog scrolls its own body (`dialogStyles.bodyBase`). A caller passing `overflow-y-auto` to the
 * dialog box as well produced two scrollbars and a scroll area with empty space below the content, so
 * those classes are dropped here, once, for every dialog in the app.
 */
export function withoutOwnScroll(className?: string): string | undefined {
  return className
    ?.split(/\s+/)
    .filter((token) => token && !OWN_SCROLL_CLASS.test(token))
    .join(" ");
}

/**
 * Jump to the top after a pagination change so the new page's first results
 * are in view. Pagination is in-route state, so the route scroll reset in
 * `RouteScrollReset` never fires for it.
 */
export function scrollPageTopOnPageChange() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

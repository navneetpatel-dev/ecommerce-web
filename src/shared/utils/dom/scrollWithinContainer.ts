/**
 * Brings `child` into view inside `container` only ("nearest" on both axes).
 * `element.scrollIntoView` also scrolls every scrollable ancestor — the window
 * included — which yanked the page back to the gallery whenever a thumbnail
 * strip re-rendered (and undid Back-button scroll restoration).
 */
export function scrollWithinContainer(
  container: HTMLElement,
  child: HTMLElement,
  behavior: ScrollBehavior = "auto",
): void {
  const box = container.getBoundingClientRect();
  const item = child.getBoundingClientRect();
  const left =
    item.left < box.left
      ? item.left - box.left
      : item.right > box.right
        ? item.right - box.right
        : 0;
  const top =
    item.top < box.top
      ? item.top - box.top
      : item.bottom > box.bottom
        ? item.bottom - box.bottom
        : 0;
  if (left || top) container.scrollBy({ left, top, behavior });
}

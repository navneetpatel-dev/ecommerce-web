/**
 * Runs inside the page. Returns every element that sticks out of the screen or is cut off by its
 * container, and text squeezed until it is unreadable. Deliberate sideways scrollers (tables,
 * carousels) and ordinary truncation are ignored.
 */
export function probe() {
  /* Narrower than this (px) and showing less than this share of the text counts as squeezed. */
  const SQUEEZED_WIDTH = 110;
  const SQUEEZED_SHARE = 0.6;
  const viewport = document.documentElement.clientWidth;
  const findings = [];
  const reported = [];

  const classOf = (el) => el.getAttribute("class") ?? "";
  const describe = (el) => {
    const classes = classOf(el).split(/\s+/).slice(0, 5).join(".");
    const text = (
      el.innerText ||
      el.getAttribute("aria-label") ||
      el.getAttribute("placeholder") ||
      ""
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50);
    return `${el.tagName.toLowerCase()}${classes ? "." + classes : ""}${text ? ` "${text}"` : ""}`;
  };
  const trail = (el) => {
    const parts = [];
    for (
      let node = el.parentElement;
      node && parts.length < 3;
      node = node.parentElement
    ) {
      parts.push(describe(node).split(' "')[0]);
    }
    return parts;
  };
  /* A box that scrolls vertically computes `overflow-x: auto` too, which is not an intent. */
  const isSidewaysScroller = (el, style) =>
    /(^|\s|:)overflow-(x-)?(auto|scroll)(\s|$)/.test(classOf(el)) ||
    (/(auto|scroll)/.test(style.overflowX) &&
      !/(auto|scroll)/.test(style.overflowY));
  const meaningful = (el) =>
    el.matches(
      "input, select, textarea, button, a[href], [role=button], [role=combobox]",
    ) ||
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) ||
    Boolean(el.querySelector("input, select, textarea, button"));

  if (document.scrollingElement.scrollWidth > viewport + 1) {
    findings.push({
      type: "page-scrolls-sideways",
      by: document.scrollingElement.scrollWidth - viewport,
    });
  }

  for (const el of document.body.querySelectorAll("*")) {
    if (reported.some((parent) => parent.contains(el))) continue;
    if (el.closest("nextjs-portal, [aria-hidden=true], [inert], svg")) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 1 || rect.height <= 1) continue;
    const style = getComputedStyle(el);
    if (
      style.visibility === "hidden" ||
      style.display === "contents" ||
      Number(style.opacity) === 0
    )
      continue;

    /* Text cut to "…" so early that little of it can be read. */
    const cutSideways =
      style.textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth + 1;
    const cutShort =
      style.webkitLineClamp !== "none" && el.scrollHeight > el.clientHeight + 1;
    if (
      (cutSideways || cutShort) &&
      el.clientWidth > 0 &&
      el.clientWidth < SQUEEZED_WIDTH
    ) {
      const shown = cutSideways
        ? el.clientWidth / el.scrollWidth
        : el.clientHeight / el.scrollHeight;
      if (shown < SQUEEZED_SHARE) {
        findings.push({
          type: "squeezed-text",
          by: el.clientWidth,
          el: describe(el),
          in: trail(el),
        });
      }
    }

    if (
      /(auto|scroll)/.test(style.overflowY) &&
      !isSidewaysScroller(el, style) &&
      el.scrollWidth > el.clientWidth + 1 &&
      !el.matches("textarea, input, select")
    ) {
      const edge = el.getBoundingClientRect().right;
      const culprit = [...el.querySelectorAll("*")].find(
        (child) => child.getBoundingClientRect().right > edge + 1,
      );
      findings.push({
        type: "container-scrolls-sideways",
        by: el.scrollWidth - el.clientWidth,
        el: describe(el),
        in: trail(el),
        widest: culprit
          ? `${describe(culprit)} <- ${trail(culprit).join(" < ")}`
          : "",
      });
    }

    if (!meaningful(el)) continue;

    let clip = null;
    let intended = false;
    let truncated =
      style.textOverflow === "ellipsis" || style.webkitLineClamp !== "none";
    let hidden = false;
    for (
      let node = el.parentElement;
      node && node !== document.body;
      node = node.parentElement
    ) {
      const s = getComputedStyle(node);
      if (Number(s.opacity) === 0 || s.visibility === "hidden") hidden = true;
      if (s.textOverflow === "ellipsis" || s.webkitLineClamp !== "none")
        truncated = true;
      if (!clip && s.overflowX !== "visible") {
        if (isSidewaysScroller(node, s)) intended = true;
        else clip = node;
      }
      if (intended) break;
    }
    if (hidden || intended || truncated) continue;

    const box = clip
      ? clip.getBoundingClientRect()
      : { left: 0, right: viewport };
    /* Wholly outside means off-canvas on purpose (closed drawers, carousel slides). */
    if (
      rect.left >= Math.min(box.right, viewport) ||
      rect.right <= Math.max(box.left, 0)
    )
      continue;
    const right = rect.right - Math.min(box.right, viewport);
    const left = Math.max(box.left, 0) - rect.left;
    const over = Math.max(right, left);
    if (over <= 1.5) continue;
    reported.push(el);
    findings.push({
      type: clip && box.right <= viewport ? "clipped" : "off-screen",
      by: Math.round(over),
      el: describe(el),
      in: trail(el),
    });
  }
  return findings;
}

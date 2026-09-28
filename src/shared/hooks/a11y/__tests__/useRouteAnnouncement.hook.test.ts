import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRouteAnnouncement } from "../useRouteAnnouncement.hook";
import { MAIN_CONTENT_ID } from "@/shared/constants/a11y/landmarks";

const { pathname } = vi.hoisted(() => ({ pathname: { current: "/" } }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

/** The shell normally renders this landmark; the hook reads its heading. */
function renderMain(heading = "Sarees") {
  const main = document.createElement("main");
  main.id = MAIN_CONTENT_ID;
  main.tabIndex = -1;
  const h1 = document.createElement("h1");
  h1.textContent = heading;
  main.appendChild(h1);
  const focus = vi.spyOn(main, "focus");
  document.body.appendChild(main);
  return { main, focus };
}

beforeEach(() => {
  pathname.current = "/";
  document.title = "Marketplace";
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("useRouteAnnouncement", () => {
  it("stays silent on the first render (initial load is not a navigation)", () => {
    const { focus } = renderMain();

    const { result } = renderHook(() => useRouteAnnouncement());

    expect(result.current).toBe("");
    expect(focus).not.toHaveBeenCalled();
  });

  it("announces the new page heading and moves focus into the page", () => {
    const { focus } = renderMain("Sarees");
    const { result, rerender } = renderHook(() => useRouteAnnouncement());

    pathname.current = "/category/sarees";
    rerender();

    expect(result.current).toBe("Sarees");
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("falls back to the document title when the page has no heading", () => {
    const main = document.createElement("main");
    main.id = MAIN_CONTENT_ID;
    document.body.appendChild(main);
    document.title = "Order #1042 | Marketplace";

    const { result, rerender } = renderHook(() => useRouteAnnouncement());
    pathname.current = "/orders/1042";
    rerender();

    expect(result.current).toBe("Order #1042 | Marketplace");
  });

  it("announces without stealing focus while the user is typing", () => {
    const { focus } = renderMain("Search results");
    const searchBox = document.createElement("input");
    document.body.appendChild(searchBox);
    searchBox.focus();

    const { result, rerender } = renderHook(() => useRouteAnnouncement());
    pathname.current = "/search";
    rerender();

    expect(result.current).toBe("Search results");
    expect(focus).not.toHaveBeenCalled();
  });

  it("stays silent for in-page anchor jumps", () => {
    renderMain();
    const { result, rerender } = renderHook(() => useRouteAnnouncement());

    window.location.hash = "#shipping";
    pathname.current = "/help/shipping";
    rerender();

    expect(result.current).toBe("");
    window.location.hash = "";
  });

  it("ignores same-path re-renders", () => {
    renderMain();
    const { result, rerender } = renderHook(() => useRouteAnnouncement());

    rerender();

    expect(result.current).toBe("");
  });
});

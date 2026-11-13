import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { takePreserveScroll } from "@/shared/utils/navigation/scrollMemory";
import { useUrlTabState } from "../useUrlTabState.hook";

let search = "";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
}));

const TABS = ["description", "reviews", "qna"] as const;

describe("useUrlTabState", () => {
  beforeEach(() => {
    search = "";
    window.history.replaceState(null, "", "/products/tee?variant=v1");
  });

  it("reads the tab from the URL, falling back for unknown values", () => {
    search = "tab=reviews";
    expect(
      renderHook(() => useUrlTabState(TABS, "description")).result.current[0],
    ).toBe("reviews");
    search = "tab=bogus";
    expect(
      renderHook(() => useUrlTabState(TABS, "description")).result.current[0],
    ).toBe("description");
  });

  it("writes the tab into the URL without a new history entry, keeping other params and the scroll", () => {
    const { result } = renderHook(() => useUrlTabState(TABS, "description"));
    const before = window.history.length;
    act(() => result.current[1]("qna"));
    expect(window.location.search).toBe("?variant=v1&tab=qna");
    expect(window.history.length).toBe(before);
    expect(takePreserveScroll()).toBe(true);
  });

  it("drops the param for the default tab", () => {
    search = "tab=qna";
    window.history.replaceState(null, "", "/products/tee?tab=qna");
    const { result } = renderHook(() => useUrlTabState(TABS, "description"));
    act(() => result.current[1]("description"));
    expect(window.location.search).toBe("");
  });
});

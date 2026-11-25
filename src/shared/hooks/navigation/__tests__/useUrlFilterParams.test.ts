import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useUrlFilterParams } from "../useUrlFilterParams.hook";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("search=Food&status=active"),
}));

describe("useUrlFilterParams", () => {
  it("reads initial values from URL search params and allows overrides/clearing", () => {
    const { result } = renderHook(() =>
      useUrlFilterParams<"search" | "status">({ search: ["q"] }),
    );
    expect(result.current.get("search")).toBe("Food");
    expect(result.current.get("status")).toBe("active");

    act(() => {
      result.current.set("search")("Electronics");
    });
    expect(result.current.get("search")).toBe("Electronics");

    act(() => {
      result.current.clearAll(["search", "status"]);
    });
    expect(result.current.get("search")).toBe("");
    expect(result.current.get("status")).toBe("");
  });
});

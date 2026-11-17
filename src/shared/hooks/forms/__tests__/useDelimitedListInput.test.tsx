import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { useDelimitedListInput } from "../useDelimitedListInput.hook";

const parseNumbers = (text: string) =>
  text
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);

const typed = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe("useDelimitedListInput", () => {
  it("keeps a trailing comma while the next entry is being typed", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useDelimitedListInput(value, parseNumbers, onChange),
      { initialProps: { value: [500] as number[] } },
    );

    act(() => result.current.handleChange(typed("500,")));
    // The parent re-renders with the parsed list, exactly as the settings form does.
    rerender({ value: [500] });
    expect(result.current.text).toBe("500,");

    act(() => result.current.handleChange(typed("500, 1000")));
    rerender({ value: [500, 1000] });
    expect(result.current.text).toBe("500, 1000");
    expect(onChange).toHaveBeenLastCalledWith([500, 1000]);
  });

  it("shows the list from outside when it changes (a reload or server normalisation)", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDelimitedListInput(value, parseNumbers, vi.fn()),
      { initialProps: { value: [500] as number[] } },
    );

    rerender({ value: [100, 200, 300] });

    expect(result.current.text).toBe("100, 200, 300");
  });
});

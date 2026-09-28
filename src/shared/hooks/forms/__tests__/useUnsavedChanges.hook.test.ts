import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useUnsavedChanges } from "../useUnsavedChanges.hook";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useUnsavedChanges", () => {
  it("blocks the unload prompt while the form is dirty", () => {
    const addSpy = vi.spyOn(window, "addEventListener");

    renderHook(() => useUnsavedChanges(true));

    expect(addSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("does not attach a listener for an untouched form", () => {
    const addSpy = vi.spyOn(window, "addEventListener");

    renderHook(() => useUnsavedChanges(false));

    expect(addSpy).not.toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );
  });

  it("marks the event as handled so the browser asks before leaving", () => {
    let handler: ((event: BeforeUnloadEvent) => void) | undefined;
    vi.spyOn(window, "addEventListener").mockImplementation(
      (type: string, listener: unknown) => {
        if (type === "beforeunload") {
          handler = listener as (event: BeforeUnloadEvent) => void;
        }
      },
    );

    renderHook(() => useUnsavedChanges(true));

    const event = {
      preventDefault: vi.fn(),
      returnValue: "",
    } as unknown as BeforeUnloadEvent;
    (event.preventDefault as unknown as ReturnType<typeof vi.fn>).mockClear();
    handler?.(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.returnValue).toBe("");
  });

  it("releases the guard once the form goes clean again", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { rerender } = renderHook(({ dirty }) => useUnsavedChanges(dirty), {
      initialProps: { dirty: true },
    });
    rerender({ dirty: false });

    expect(removeSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );
  });
});

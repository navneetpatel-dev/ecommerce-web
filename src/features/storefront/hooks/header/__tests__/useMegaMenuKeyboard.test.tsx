import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { useMegaMenuKeyboard } from "../useMegaMenuKeyboard.hook";

function Harness() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((value) => !value);
  const close = () => setOpen(false);
  const { triggerRef, handleKeyDown } = useMegaMenuKeyboard({
    open,
    menuId: "panel",
    onToggle: toggle,
    onClose: close,
  });
  return (
    <div role="presentation" onKeyDown={handleKeyDown}>
      <button ref={triggerRef} type="button" aria-expanded={open}>
        Categories
      </button>
      {open ? (
        <div id="panel">
          <a href="/a">Audio</a>
          <a href="/b">Books</a>
          <a href="/c">Cameras</a>
        </div>
      ) : null}
    </div>
  );
}

/** B-14: the Categories panel is reachable and walkable with the keyboard. */
describe("useMegaMenuKeyboard", () => {
  it("opens on ArrowDown and moves into the first link", () => {
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Categories" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Audio" })).toHaveFocus();
  });

  it("steps, wraps and jumps through the links", () => {
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Categories" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const audio = screen.getByRole("link", { name: "Audio" });
    fireEvent.keyDown(audio, { key: "ArrowDown" });
    expect(screen.getByRole("link", { name: "Books" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("link", { name: "Books" }), {
      key: "End",
    });
    expect(screen.getByRole("link", { name: "Cameras" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("link", { name: "Cameras" }), {
      key: "ArrowDown",
    });
    expect(audio).toHaveFocus();
    fireEvent.keyDown(audio, { key: "ArrowUp" });
    expect(screen.getByRole("link", { name: "Cameras" })).toHaveFocus();
  });

  it("closes on Escape and returns focus to the button", () => {
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Categories" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("link", { name: "Audio" }), {
      key: "Escape",
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});

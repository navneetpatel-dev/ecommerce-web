import { describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { useState } from "react";
import { useScrollAlertsIntoView } from "../useScrollAlertsIntoView.hook";

function Box() {
  const ref = useScrollAlertsIntoView<HTMLDivElement>();
  const [shown, setShown] = useState(false);
  return (
    <div ref={ref}>
      <button onClick={() => setShown(true)}>fail</button>
      {shown ? <p role="alert">Boom</p> : null}
      <p>note</p>
    </div>
  );
}

describe("useScrollAlertsIntoView", () => {
  it("scrolls an alert that appears into view, and nothing else", async () => {
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    const { getByText } = render(<Box />);
    await act(async () => {
      getByText("fail").click();
      await Promise.resolve();
    });
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll).toHaveBeenCalledWith(
      expect.objectContaining({ block: "nearest" }),
    );
  });
});

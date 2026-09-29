import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { OfflineNotice } from "../OfflineNotice.component";
import { LABELS } from "@/shared/constants/labels";

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
}

afterEach(() => {
  setOnline(true);
});

describe("OfflineNotice", () => {
  it("says nothing while the customer is connected", () => {
    setOnline(true);

    const { container } = render(<OfflineNotice />);

    expect(container).toBeEmptyDOMElement();
  });

  it("explains that prices and stock may be stale once offline", () => {
    setOnline(false);

    render(<OfflineNotice />);

    const notice = screen.getByRole("status");
    expect(notice).toHaveTextContent(LABELS.offlineNoticeTitle);
    expect(notice).toHaveTextContent(LABELS.offlineNoticeBody);
  });
});

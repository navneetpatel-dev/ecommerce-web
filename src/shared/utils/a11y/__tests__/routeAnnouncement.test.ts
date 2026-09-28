import { afterEach, describe, expect, it } from "vitest";
import {
  announcementForPageTitle,
  isClientNavigation,
  shouldMoveFocusToMain,
} from "../routeAnnouncement";
import { LABELS } from "@/shared/constants/labels";

function element(tag: string, attributes: Record<string, string> = {}) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    node.setAttribute(key, value);
  }
  return node;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.title = "";
});

describe("announcementForPageTitle", () => {
  it("collapses the heading into one clean sentence", () => {
    expect(announcementForPageTitle("  Sarees\n  · 12 results ")).toBe(
      "Sarees · 12 results",
    );
  });

  it("falls back to a generic message rather than announcing nothing", () => {
    expect(announcementForPageTitle(null)).toBe(LABELS.pageLoadedFallback);
    expect(announcementForPageTitle("   ")).toBe(LABELS.pageLoadedFallback);
  });
});

describe("shouldMoveFocusToMain", () => {
  it("moves focus when nothing (or the body) is focused", () => {
    expect(shouldMoveFocusToMain(null)).toBe(true);
    expect(shouldMoveFocusToMain(document.body)).toBe(true);
  });

  it("leaves focus alone while the user is typing", () => {
    expect(shouldMoveFocusToMain(element("input"))).toBe(false);
    expect(shouldMoveFocusToMain(element("textarea"))).toBe(false);
    expect(shouldMoveFocusToMain(element("select"))).toBe(false);
    expect(
      shouldMoveFocusToMain(element("div", { contenteditable: "true" })),
    ).toBe(false);
  });

  it("leaves focus to an open overlay that owns it", () => {
    const dialog = element("div", { role: "dialog" });
    const button = element("button");
    dialog.appendChild(button);
    document.body.appendChild(dialog);

    expect(shouldMoveFocusToMain(button)).toBe(false);
  });

  it("moves focus off a link the user just activated", () => {
    const link = element("a");
    document.body.appendChild(link);

    expect(shouldMoveFocusToMain(link)).toBe(true);
  });
});

describe("isClientNavigation", () => {
  it("treats a new pathname as navigation", () => {
    expect(isClientNavigation("/cart", "/orders", "")).toBe(true);
  });

  it("ignores same-path re-renders and in-page anchors", () => {
    expect(isClientNavigation("/cart", "/cart", "")).toBe(false);
    expect(isClientNavigation("/faq", "/help", "#shipping")).toBe(false);
  });
});

import { describe, expect, it, beforeEach, vi } from "vitest";
import { TOAST_MAX_VISIBLE } from "@/shared/constants/timing/timing";
import { notifySuccess, useToastStore } from "../toast.store";
import { notifyError } from "../errorToast.store";

describe("toast store", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("keeps only the newest toasts once the visible cap is exceeded", () => {
    for (let i = 0; i < TOAST_MAX_VISIBLE + 1; i += 1) {
      useToastStore.getState().push({ kind: "info", message: `m${i}` });
    }

    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(TOAST_MAX_VISIBLE);
    expect(toasts[0].message).toBe("m1");
    expect(toasts.at(-1)?.message).toBe(`m${TOAST_MAX_VISIBLE}`);
  });

  it("still routes notifyError into the queue (call-site compatibility)", () => {
    notifyError("Download failed");

    const [toast] = useToastStore.getState().toasts;
    expect(toast.kind).toBe("error");
    expect(toast.message).toBe("Download failed");
  });

  it("stores a callback action and runs it when the toast action fires", () => {
    const undoSomething = vi.fn();
    notifySuccess("Removed from your cart.", {
      label: "Undo",
      onClick: undoSomething,
    });

    const toast = useToastStore.getState().toasts.at(-1);
    expect(toast?.actionLabel).toBe("Undo");
    expect(toast?.actionHref).toBeUndefined();

    useToastStore.getState().runAction(toast!.id);

    expect(undoSomething).toHaveBeenCalledTimes(1);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("keeps href actions as links (no callback)", () => {
    notifySuccess("Coupon applied.", { label: "View cart", href: "/cart" });

    const toast = useToastStore.getState().toasts.at(-1);
    expect(toast?.actionHref).toBe("/cart");
    expect(toast?.action).toBeUndefined();
  });

  it("dismiss removes only the targeted toast", () => {
    useToastStore.getState().push({ kind: "success", message: "saved" });
    useToastStore.getState().push({ kind: "error", message: "failed" });

    const [first, second] = useToastStore.getState().toasts;
    useToastStore.getState().dismiss(first.id);

    const remaining = useToastStore.getState().toasts;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(second.id);
  });
});

import { describe, expect, it, beforeEach } from "vitest";
import { TOAST_MAX_VISIBLE } from "@/shared/constants/timing/timing";
import { useToastStore } from "../toast.store";
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

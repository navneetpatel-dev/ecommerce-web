import { act, renderHook, waitFor } from "@testing-library/react";
import type { ChangeEvent, FormEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { contactApi } from "../../../api/contact/contact.api";
import { useContactMessageForm } from "../useContactMessageForm.hook";

vi.mock("../../../api/contact/contact.api", () => ({
  contactApi: { send: vi.fn() },
}));

const typed = (value: string) =>
  ({ target: { value } }) as unknown as ChangeEvent<HTMLInputElement>;
const submitEvent = { preventDefault: vi.fn() } as unknown as FormEvent;

function fillValid(result: {
  current: ReturnType<typeof useContactMessageForm>;
}) {
  act(() => {
    result.current.handleName(typed("Karan Joshi"));
    result.current.handleEmail(typed("karan@example.com"));
    result.current.handleTopic("ORDER");
    result.current.handleSubject(typed("Where is my order"));
    result.current.handleMessage({
      target: { value: "It has not moved since Monday." },
    } as unknown as ChangeEvent<HTMLTextAreaElement>);
  });
}

describe("useContactMessageForm", () => {
  beforeEach(() => {
    vi.mocked(contactApi.send).mockReset();
  });

  it("shows a message for each invalid field and sends nothing", async () => {
    const { result } = renderHook(() => useContactMessageForm());

    await act(async () => result.current.handleSubmit(submitEvent));

    expect(result.current.getError("name")).toBeTruthy();
    expect(result.current.getError("email")).toBeTruthy();
    expect(result.current.getError("topic")).toBeTruthy();
    expect(result.current.getError("subject")).toBeTruthy();
    expect(result.current.getError("message")).toBeTruthy();
    expect(contactApi.send).not.toHaveBeenCalled();
  });

  it("clears a field's error as soon as it is edited", async () => {
    const { result } = renderHook(() => useContactMessageForm());
    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.getError("name")).toBeTruthy();

    act(() => result.current.handleName(typed("Karan")));

    expect(result.current.getError("name")).toBeUndefined();
  });

  it("sends the trimmed message and shows the reference from the confirmation", async () => {
    vi.mocked(contactApi.send).mockResolvedValue({ reference: "CM-7F3A9C" });
    const { result } = renderHook(() => useContactMessageForm());
    fillValid(result);

    await act(async () => result.current.handleSubmit(submitEvent));

    expect(contactApi.send).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Karan Joshi",
        email: "karan@example.com",
        topic: "ORDER",
        subject: "Where is my order",
        website: "",
      }),
    );
    await waitFor(() => expect(result.current.reference).toBe("CM-7F3A9C"));
  });

  it("keeps the form and reports an error when sending fails, then resets for another message", async () => {
    vi.mocked(contactApi.send).mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useContactMessageForm());
    fillValid(result);

    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.submitError).toBeTruthy();
    expect(result.current.reference).toBeNull();
    expect(result.current.pending).toBe(false);

    vi.mocked(contactApi.send).mockResolvedValue({ reference: "CM-000001" });
    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.reference).toBe("CM-000001");

    act(() => result.current.handleSendAnother());
    expect(result.current.reference).toBeNull();
    expect(result.current.values.subject).toBe("");
    expect(result.current.values.name).toBe("Karan Joshi");
  });
});

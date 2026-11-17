import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notificationsApi } from "../../../api/notifications/notifications.api";
import { useEmailTemplatesPage } from "../useEmailTemplatesPage.hook";

vi.mock("../../../api/notifications/notifications.api", () => ({
  notificationsApi: {
    templates: vi.fn(),
    previewTemplate: vi.fn(),
    sendTemplateTest: vi.fn(),
  },
}));

const CATALOGUE = [
  {
    type: "WELCOME",
    audience: "customer",
    group: "Account & security",
    subject: "Welcome aboard",
    marketing: false,
  },
  {
    type: "PASSWORD_RESET",
    audience: "customer",
    group: "Account & security",
    subject: "Reset your password",
    marketing: false,
  },
  {
    type: "VENDOR_APPROVED",
    audience: "vendor",
    group: "Seller account",
    subject: "Your vendor account is approved",
    marketing: false,
  },
];

function setup() {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      {children}
    </QueryClientProvider>
  );
  return renderHook(() => useEmailTemplatesPage(), { wrapper });
}

describe("useEmailTemplatesPage", () => {
  beforeEach(() => {
    vi.mocked(notificationsApi.templates).mockResolvedValue(CATALOGUE as never);
    vi.mocked(notificationsApi.previewTemplate).mockResolvedValue({
      subject: "Welcome aboard",
      html: "<p>hi</p>",
      text: "hi",
    });
    vi.mocked(notificationsApi.sendTemplateTest).mockResolvedValue({
      sentTo: "admin@example.com",
    });
  });

  it("groups the catalogue by audience and group", async () => {
    const { result } = setup();
    await waitFor(() => expect(result.current.groups).toHaveLength(2));
    expect(result.current.groups[0]).toMatchObject({
      group: "Account & security",
      audience: "customer",
    });
    expect(result.current.groups[0]!.templates).toHaveLength(2);
    expect(result.current.groups[1]).toMatchObject({ audience: "vendor" });
  });

  it("previews the chosen template in the chosen theme", async () => {
    const { result } = setup();
    await waitFor(() =>
      expect(result.current.groups.length).toBeGreaterThan(0),
    );

    act(() => result.current.handleSelect("WELCOME"));
    await waitFor(() => expect(result.current.previewHtml).toBe("<p>hi</p>"));
    expect(notificationsApi.previewTemplate).toHaveBeenCalledWith(
      "WELCOME",
      "light",
    );

    act(() => result.current.handleDark());
    await waitFor(() =>
      expect(notificationsApi.previewTemplate).toHaveBeenCalledWith(
        "WELCOME",
        "dark",
      ),
    );
  });

  it("sends a test and says where it went", async () => {
    const { result } = setup();
    await waitFor(() =>
      expect(result.current.groups.length).toBeGreaterThan(0),
    );
    act(() => result.current.handleSelect("WELCOME"));

    await act(async () => result.current.handleSendTest());

    await waitFor(() =>
      expect(result.current.notice).toContain("admin@example.com"),
    );
    expect(notificationsApi.sendTemplateTest).toHaveBeenCalledWith("WELCOME");
  });

  it("reports a catalogue that fails to load", async () => {
    vi.mocked(notificationsApi.templates).mockRejectedValue(new Error("boom"));
    const { result } = setup();
    await waitFor(() => expect(result.current.loadError).toBeTruthy());
  });
});

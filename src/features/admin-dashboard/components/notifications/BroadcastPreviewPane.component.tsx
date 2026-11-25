"use client";

import { useState } from "react";
import { Bell, Mail, Moon, Smartphone, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { BroadcastChannel } from "../../api/notifications/notifications.api";

interface BroadcastPreviewPaneProps {
  subject: string;
  message: string;
  ctaLabel?: string;
  channels: BroadcastChannel[];
  renderPreview: { subject: string; html: string } | null;
  previewTheme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

function previewInterpolate(text: string): string {
  return text
    .replace(/\{\{firstName\}\}/g, "Alex")
    .replace(/\{\{fullName\}\}/g, "Alex Sharma")
    .replace(/\{\{email\}\}/g, "alex@example.com")
    .replace(/\{\{role\}\}/g, "CUSTOMER")
    .replace(/\{\{businessName\}\}/g, "Apex Essentials")
    .replace(/\{\{city\}\}/g, "Bengaluru");
}

export function BroadcastPreviewPane({
  subject,
  message,
  ctaLabel,
  channels,
  renderPreview,
  previewTheme,
  onThemeChange,
}: BroadcastPreviewPaneProps) {
  const [tab, setTab] = useState<BroadcastChannel>(channels[0] ?? "EMAIL");
  const activeTab = channels.includes(tab) ? tab : (channels[0] ?? "EMAIL");
  const sampleTitle = previewInterpolate(subject || "Announcement subject");
  const sampleBody = previewInterpolate(
    message || "Your broadcast message will appear here.",
  );

  return (
    <div className="flex flex-col rounded-xl border border-line bg-paper/60 overflow-hidden h-full min-h-[24rem]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3.5 py-2.5 bg-surface/60">
        <div className="flex items-center gap-1">
          {channels.includes("EMAIL") && (
            <Button
              type="button"
              size="sm"
              variant={activeTab === "EMAIL" ? "secondary" : "ghost"}
              onClick={() => setTab("EMAIL")}
            >
              <Mail className="size-3.5" aria-hidden />
              Email
            </Button>
          )}
          {channels.includes("PUSH") && (
            <Button
              type="button"
              size="sm"
              variant={activeTab === "PUSH" ? "secondary" : "ghost"}
              onClick={() => setTab("PUSH")}
            >
              <Smartphone className="size-3.5" aria-hidden />
              Push
            </Button>
          )}
          {channels.includes("IN_APP") && (
            <Button
              type="button"
              size="sm"
              variant={activeTab === "IN_APP" ? "secondary" : "ghost"}
              onClick={() => setTab("IN_APP")}
            >
              <Bell className="size-3.5" aria-hidden />
              In-App
            </Button>
          )}
        </div>
        {activeTab === "EMAIL" && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant={previewTheme === "light" ? "secondary" : "ghost"}
              onClick={() => onThemeChange("light")}
              aria-label="Light preview"
            >
              <Sun className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={previewTheme === "dark" ? "secondary" : "ghost"}
              onClick={() => onThemeChange("dark")}
              aria-label="Dark preview"
            >
              <Moon className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {activeTab === "EMAIL" ? (
        renderPreview?.html ? (
          <iframe
            title="Broadcast email preview"
            sandbox=""
            srcDoc={renderPreview.html}
            className="w-full flex-1 min-h-[22rem] bg-paper"
          />
        ) : (
          <div className="p-6 text-body-sm text-ink-muted">
            Rendering email preview…
          </div>
        )
      ) : activeTab === "PUSH" ? (
        <div className="p-5 flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-4 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 text-caption text-ink-muted">
              <Smartphone className="size-3.5 text-brand" />
              <span>Marketplace · now</span>
            </div>
            <p className="text-body-sm font-semibold text-ink">{sampleTitle}</p>
            <p className="text-body-xs text-ink-muted line-clamp-3">
              {sampleBody}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-4 space-y-2">
            <div className="flex items-center justify-between text-caption text-ink-muted">
              <span className="inline-flex items-center gap-1.5 font-medium text-brand">
                <Bell className="size-3.5" />
                In-App Notification
              </span>
              <span>Just now</span>
            </div>
            <p className="text-body-sm font-semibold text-ink">{sampleTitle}</p>
            <p className="text-body-xs text-ink-muted whitespace-pre-line">
              {sampleBody}
            </p>
            {ctaLabel ? (
              <span className="inline-block rounded-md bg-brand/15 px-2.5 py-1 text-caption font-medium text-brand">
                {ctaLabel} →
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

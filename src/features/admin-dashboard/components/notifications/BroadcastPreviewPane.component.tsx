"use client";

import { useState } from "react";
import { Bell, Mail, Moon, Smartphone, Sun } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
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
    <div className="flex flex-col rounded-xl border border-line/80 bg-surface overflow-hidden h-full min-h-[26rem] lg:min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/80 px-3.5 py-2.5 bg-paper/60 shrink-0">
        <div className="inline-flex items-center rounded-lg border border-line bg-surface p-0.5 gap-0.5">
          {(
            [
              { id: "EMAIL", label: "Email", icon: Mail },
              { id: "PUSH", label: "Web Push", icon: Smartphone },
              { id: "IN_APP", label: "In-App", icon: Bell },
            ] as const
          )
            .filter((item) => channels.includes(item.id))
            .map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-7 rounded-md px-2.5 text-xs font-medium transition-colors cursor-pointer",
                  activeTab === id
                    ? "bg-brand/15 text-brand"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                <Icon className="size-3.5" aria-hidden />
                <span>{label}</span>
              </button>
            ))}
        </div>

        {activeTab === "EMAIL" && (
          <div className="inline-flex items-center rounded-lg border border-line bg-surface p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => onThemeChange("light")}
              aria-label="Light preview"
              className={cn(
                "inline-flex items-center justify-center size-7 rounded-md cursor-pointer transition-colors",
                previewTheme === "light"
                  ? "bg-brand/15 text-brand"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              <Sun className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onThemeChange("dark")}
              aria-label="Dark preview"
              className={cn(
                "inline-flex items-center justify-center size-7 rounded-md cursor-pointer transition-colors",
                previewTheme === "dark"
                  ? "bg-brand/15 text-brand"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              <Moon className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {activeTab === "EMAIL" ? (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="border-b border-line/60 bg-paper/40 px-4 py-2 text-xs text-ink-muted truncate shrink-0">
            <span className="font-medium text-ink">Subject:</span>{" "}
            {renderPreview?.subject || sampleTitle}
          </div>
          {renderPreview?.html ? (
            <iframe
              title="Broadcast email preview"
              sandbox=""
              srcDoc={renderPreview.html}
              className="w-full flex-1 min-h-[24rem] lg:min-h-0 bg-paper border-0"
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-xs text-ink-muted">
              Rendering email preview…
            </div>
          )}
        </div>
      ) : activeTab === "PUSH" ? (
        <div className="p-6 flex-1 flex items-center justify-center bg-paper/30">
          <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-4 shadow-md space-y-1.5">
            <div className="flex items-center gap-2 text-caption text-ink-muted">
              <Smartphone className="size-3.5 text-brand" />
              <span>Marketplace · now</span>
            </div>
            <p className="text-sm font-semibold text-ink">{sampleTitle}</p>
            <p className="text-xs text-ink-muted line-clamp-3">{sampleBody}</p>
          </div>
        </div>
      ) : (
        <div className="p-6 flex-1 flex items-center justify-center bg-paper/30">
          <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-4 shadow-md space-y-2">
            <div className="flex items-center justify-between text-caption text-ink-muted">
              <span className="inline-flex items-center gap-1.5 font-medium text-brand">
                <Bell className="size-3.5" />
                In-App Notification
              </span>
              <span>Just now</span>
            </div>
            <p className="text-sm font-semibold text-ink">{sampleTitle}</p>
            <p className="text-xs text-ink-muted whitespace-pre-line">
              {sampleBody}
            </p>
            {ctaLabel ? (
              <span className="inline-block rounded-md bg-brand/15 px-2.5 py-1 text-xs font-medium text-brand">
                {ctaLabel} →
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

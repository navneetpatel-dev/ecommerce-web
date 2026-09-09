"use client";

import { Bell } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { usePushSubscription } from "@/shared/hooks/usePushSubscription.hook";

export function BrowserNotificationsSetting() {
  const push = usePushSubscription();

  const unsupportedNotice = !push.supported ? (
    <p className="mt-2 text-body-sm text-ink-muted">
      This browser does not support push notifications.
    </p>
  ) : null;
  const errorNotice = push.error ? (
    <p className="mt-2 text-body-sm text-danger">{push.error}</p>
  ) : null;
  const switchDisabled = !push.supported || push.pending;

  return (
    <section className="border border-line bg-surface px-5 py-4 shadow-elevation-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Bell
            className="mt-0.5 size-5 shrink-0 text-brand"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-display text-[1.125rem] text-ink">
              Browser notifications
            </h2>
            <p className="mt-0.5 text-body-sm text-ink-muted">
              Receive order, shipment, return, and refund updates on this
              device.
            </p>
            {unsupportedNotice}
            {errorNotice}
          </div>
        </div>
        <Switch
          aria-label="Browser notifications"
          checked={push.enabled}
          disabled={switchDisabled}
          onCheckedChange={(checked) => void push.toggle(checked)}
        />
      </div>
    </section>
  );
}

import { Bell } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import type { usePushSubscription } from "@/shared/hooks/usePushSubscription.hook";

interface PushNotificationsSectionProps {
  push: ReturnType<typeof usePushSubscription>;
}

export function PushNotificationsSection({
  push,
}: PushNotificationsSectionProps) {
  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
        <TextEyebrow>DEVICE ALERTS</TextEyebrow>
        <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
          Task push notifications
        </h2>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          Receive instant alerts on this device whenever tasks are assigned or
          updated.
        </p>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 rounded-lg border border-line bg-paper/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded border border-line bg-surface text-brand">
              <Bell size={18} strokeWidth={1.5} />
            </span>
            <div className="space-y-1">
              <span className="block font-medium text-ink">
                Real-time device notifications
              </span>
              <p className="text-body-sm text-ink-muted">
                Receive audible alerts and task updates directly in your browser
                or device lockscreen.
              </p>
              {push.error ? (
                <p className="mt-1 text-body-sm text-danger">{push.error}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <Switch
              checked={push.enabled}
              disabled={!push.supported || push.pending}
              onCheckedChange={(checked) => void push.toggle(checked)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

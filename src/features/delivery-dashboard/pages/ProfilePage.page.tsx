"use client";

import { Bike, Bell } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import {
  useDeliveryProfile,
  useSetAvailability,
} from "../api/deliveryAgent.queries";
import { usePushSubscription } from "@/shared/hooks/usePushSubscription.hook";

export function DeliveryProfilePage() {
  const profile = useDeliveryProfile();
  const availability = useSetAvailability();
  const push = usePushSubscription();
  const agent = profile.data;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-[1.75rem] text-ink">Profile</h1>
        <p className="mt-1 text-body text-ink-muted">
          Field availability and device alerts.
        </p>
      </header>
      <section className="border-y border-line py-5">
        <div className="flex items-start gap-3">
          <Bike className="mt-1 size-5 text-brand" aria-hidden="true" />
          <div>
            <p className="font-medium text-ink">
              {agent?.fullName ?? "Delivery agent"}
            </p>
            <p className="text-body-sm text-ink-muted">
              {agent
                ? `${agent.vehicleType} · ${agent.hubOrZone}`
                : "Loading profile..."}
            </p>
          </div>
        </div>
      </section>
      <label className="flex items-center justify-between gap-4 border-b border-line pb-5">
        <span>
          <span className="block font-medium text-ink">
            Available for assignments
          </span>
          <span className="text-body-sm text-ink-muted">
            Operations can assign new tasks while enabled.
          </span>
        </span>
        <Switch
          checked={agent?.availableForAssignment ?? false}
          disabled={!agent || availability.isPending}
          onCheckedChange={(checked) => availability.mutate(checked)}
        />
      </label>
      <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
        <span className="flex min-w-0 items-start gap-3">
          <Bell
            className="mt-0.5 size-5 shrink-0 text-brand"
            aria-hidden="true"
          />
          <span>
            <span className="block font-medium text-ink">
              Task notifications
            </span>
            <span className="text-body-sm text-ink-muted">
              Receive new assignment alerts on this device.
            </span>
            {push.error ? (
              <span className="mt-1 block text-body-sm text-danger">
                {push.error}
              </span>
            ) : null}
          </span>
        </span>
        <Switch
          checked={push.enabled}
          disabled={!push.supported || push.pending}
          onCheckedChange={(checked) => void push.toggle(checked)}
        />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Bike, Bell, MapPin, ArrowRight, Star, Truck } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { PATHS } from "@/shared/constants/paths";
import {
  useDeliveryProfile,
  useSetAvailability,
  BankDetailsCard,
  CashDepositsCard,
  EarningsPayoutsCard,
  DeliveryAgentDocumentsCard,
  useMyRatingsQuery,
} from "@/features/delivery-dashboard";
import { usePushSubscription } from "@/shared/hooks/usePushSubscription.hook";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

export function DeliveryOperationsSection() {
  const profile = useDeliveryProfile();
  const ratings = useMyRatingsQuery();
  const availability = useSetAvailability();
  const push = usePushSubscription();
  const agent = profile.data;

  if (profile.isLoading) {
    return (
      <div className="space-y-6">
        <div className="border border-line bg-surface p-6 shadow-elevation-1 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="mt-4 h-12 w-full" />
        </div>
      </div>
    );
  }

  const isBike =
    agent?.vehicleType === "BIKE" || agent?.vehicleType === "SCOOTER";
  const VehicleIcon = isBike ? Bike : Truck;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]">
        {/* Main Controls Column */}
        <div className="space-y-6">
          {/* Section 1: Availability */}
          <section className="border border-line bg-surface shadow-elevation-1">
            <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
              <TextEyebrow>FIELD CONTROLS</TextEyebrow>
              <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
                Live assignment availability
              </h2>
              <p className="mt-1 text-[0.875rem] text-ink-muted">
                Configure whether operations can assign new deliveries and
                return pickups to you.
              </p>
            </div>

            <div className="p-5 md:p-6">
              <div className="flex flex-col gap-4 rounded-lg border border-line bg-paper/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink">
                      Available for task assignments
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.75rem] font-medium ${
                        agent?.availableForAssignment
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-ink-muted/10 text-ink-muted border border-line"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          agent?.availableForAssignment
                            ? "bg-success"
                            : "bg-ink-muted"
                        }`}
                      />
                      {agent?.availableForAssignment ? "On Duty" : "Off Duty"}
                    </span>
                  </div>
                  <p className="text-body-sm text-ink-muted">
                    Operations dispatch can assign active shipments and
                    scheduled return pickups while enabled.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Switch
                    checked={agent?.availableForAssignment ?? false}
                    disabled={!agent || availability.isPending}
                    onCheckedChange={(checked) => availability.mutate(checked)}
                  />
                </div>
              </div>
              {availability.isError ? (
                <p className="mt-3 text-body-sm text-danger">
                  {getApiErrorMessage(
                    availability.error,
                    "Could not update availability.",
                  )}
                </p>
              ) : null}
            </div>
          </section>

          {/* Section 1b: Verification documents (required before going on duty) */}
          <DeliveryAgentDocumentsCard />

          {/* Section 2: Task Notifications */}
          <section className="border border-line bg-surface shadow-elevation-1">
            <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
              <TextEyebrow>DEVICE ALERTS</TextEyebrow>
              <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
                Task push notifications
              </h2>
              <p className="mt-1 text-[0.875rem] text-ink-muted">
                Receive instant alerts on this device whenever tasks are
                assigned or updated.
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
                      Receive audible alerts and task updates directly in your
                      browser or device lockscreen.
                    </p>
                    {push.error ? (
                      <p className="mt-1 text-body-sm text-danger">
                        {push.error}
                      </p>
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

          {/* Section 3: Registered Vehicle & Hub Zone */}
          <section className="border border-line bg-surface shadow-elevation-1">
            <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
              <TextEyebrow>DISPATCH REGISTRY</TextEyebrow>
              <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
                Fleet details & operating zone
              </h2>
              <p className="mt-1 text-[0.875rem] text-ink-muted">
                Your registered vehicle class and geographic operating zone.
              </p>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3.5 rounded-lg border border-line bg-paper/40 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line bg-surface text-brand">
                    <VehicleIcon size={20} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                      Vehicle Class
                    </p>
                    <p className="font-medium text-ink">
                      {agent?.vehicleType ?? "Not registered"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-lg border border-line bg-paper/40 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line bg-surface text-brand">
                    <MapPin size={20} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                      Operating Hub / Zone
                    </p>
                    <p className="font-medium text-ink">
                      {agent?.hubOrZone ?? "Unassigned"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-body-sm text-ink-faint">
                Vehicle type and hub assignments are verified and updated by the
                platform operations team.
              </p>
            </div>
          </section>

          {/* Section 4: Payout Destination */}
          <BankDetailsCard bankDetails={agent?.bankDetails} />

          {/* Section 5: Cash deposit reconciliation history */}
          <CashDepositsCard />

          {/* Section 6: Earnings & Payout History */}
          <EarningsPayoutsCard />
        </div>

        {/* Aside Column */}
        <aside className="space-y-6">
          <div className="border border-line bg-surface shadow-elevation-1">
            <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
              <TextEyebrow>OPERATING STATUS</TextEyebrow>
              <p className="mt-1 text-[0.875rem] text-ink-muted">
                Live delivery partner status.
              </p>
            </div>

            <div className="space-y-4 p-5 md:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-brand">
                  <VehicleIcon size={20} strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                    Partner Name
                  </p>
                  <p className="mt-0.5 font-medium text-ink">
                    {agent?.fullName ?? "Delivery Partner"}
                  </p>
                  <p className="text-body-sm text-ink-muted">{agent?.phone}</p>
                  <p className="mt-1 flex items-center gap-1 text-body-sm">
                    {(ratings.data?.ratingCount ?? agent?.ratingCount) ? (
                      <>
                        <Star
                          className="size-3.5 fill-warning text-warning"
                          aria-hidden="true"
                        />
                        <span className="font-medium text-ink">
                          {(
                            ratings.data?.averageRating ??
                            agent?.averageRating ??
                            0
                          ).toFixed(1)}
                        </span>
                        <span className="text-ink-muted">
                          ({ratings.data?.ratingCount ?? agent?.ratingCount}{" "}
                          rating
                          {(ratings.data?.ratingCount ?? agent?.ratingCount) ===
                          1
                            ? ""
                            : "s"}
                          )
                        </span>
                      </>
                    ) : (
                      <span className="text-ink-muted">No ratings yet</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="border-t border-line/60 pt-4 space-y-2">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-ink-muted">Duty status:</span>
                  <span className="font-medium text-ink">
                    {agent?.availableForAssignment
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-ink-muted">Station / Hub:</span>
                  <span className="font-mono text-ink text-body-sm">
                    {agent?.hubOrZone ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-ink-muted">System status:</span>
                  <StatusBadge status={agent?.status ?? "ACTIVE"} />
                </div>
              </div>

              <div className="border-t border-line/60 pt-4">
                <Button
                  variant="outline"
                  className="w-full gap-2 justify-between"
                  asChild
                >
                  <Link href={PATHS.delivery.today}>
                    <span>Open Field Queue</span>
                    <ArrowRight size={15} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

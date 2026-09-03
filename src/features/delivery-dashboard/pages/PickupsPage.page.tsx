"use client";

import { TaskCard } from "../components/TaskCard.component";
import { useMyPickups } from "../api/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";

export function PickupsPage() {
  const query = useMyPickups(["PICKUP_SCHEDULED"]);
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h1 className="font-display text-[1.75rem] text-ink">Pickups</h1>
        <p className="mt-1 text-body text-ink-muted">
          Scheduled refund and exchange collections.
        </p>
      </header>
      {query.isError ? (
        <QueryErrorAlert
          error={query.error}
          fallback="Could not load pickups."
        />
      ) : null}
      <div className="space-y-3">
        {query.data?.map((pickup) => (
          <TaskCard
            key={pickup.id}
            href={PATHS.delivery.pickup(pickup.id)}
            title={pickup.productName ?? `Return ${pickup.id.slice(0, 8)}`}
            subtitle={`${pickup.type} · ${pickup.user?.name ?? "Customer"}`}
            status={pickup.status}
          />
        ))}
      </div>
      {!query.isLoading && !query.data?.length ? (
        <p className="text-ink-muted">No scheduled pickups.</p>
      ) : null}
    </div>
  );
}

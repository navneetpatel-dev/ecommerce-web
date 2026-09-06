"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TaskCard } from "../components/TaskCard.component";
import { BarcodeScanButton } from "../components/BarcodeScanButton.component";
import { useMyPickups } from "../api/deliveryAgent.queries";
import { PATHS } from "@/shared/constants/paths";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";

export function PickupsPage() {
  const router = useRouter();
  const [scanError, setScanError] = useState<string | null>(null);
  const query = useMyPickups(["PICKUP_SCHEDULED"]);
  const count = query.data?.length ?? 0;

  // Return pickups have no tracking number of their own — match the scanned
  // code against the pickup's id, same field the list already routes on.
  const handleScanned = (text: string) => {
    const match = query.data?.find(
      (pickup) => pickup.id.toUpperCase() === text.toUpperCase(),
    );
    if (!match) {
      setScanError(`No scheduled pickup matches "${text}".`);
      return;
    }
    setScanError(null);
    router.push(PATHS.delivery.pickup(match.id));
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <header className="flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.75rem] text-ink">Pickups</h1>
          <p className="mt-1 text-body text-ink-muted">
            Scheduled refund and exchange collections from customers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-body-sm text-ink-muted">
            {count} scheduled pickup{count === 1 ? "" : "s"}
          </span>
          <BarcodeScanButton onDecoded={handleScanned} />
        </div>
      </header>

      {scanError ? (
        <p className="text-body-sm text-danger">{scanError}</p>
      ) : null}

      {query.isError ? (
        <QueryErrorAlert
          error={query.error}
          fallback="Could not load pickups."
        />
      ) : null}

      {query.isLoading ? (
        <p className="text-ink-muted">Loading pickups...</p>
      ) : count > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {query.data?.map((pickup) => (
            <TaskCard
              key={pickup.id}
              href={PATHS.delivery.pickup(pickup.id)}
              title={
                pickup.orderItem?.productName ??
                pickup.productName ??
                `Return ${pickup.id.slice(0, 8)}`
              }
              subtitle={`${pickup.type} · ${pickup.user?.name ?? "Customer"}`}
              status={pickup.status}
            />
          ))}
        </div>
      ) : (
        <p className="border-l-2 border-brand/30 pl-3 text-body text-ink-muted py-2">
          No scheduled pickups.
        </p>
      )}
    </div>
  );
}

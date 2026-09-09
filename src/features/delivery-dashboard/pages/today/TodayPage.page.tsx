"use client";

import { ShiftSummaryCard } from "../../components/today/ShiftSummaryCard.component";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { todayPageStyles } from "./todayPage.styles";
import { useTodayPage } from "../../hooks/today/useTodayPage.hook";
import { TodayDeliveriesList } from "../../components/today/TodayDeliveriesList.component";
import { TodayPickupsList } from "../../components/today/TodayPickupsList.component";

export function TodayPage() {
  const page = useTodayPage();

  return (
    <div className={todayPageStyles.container}>
      <header className={todayPageStyles.header}>
        <div>
          <p className={todayPageStyles.queueBadge}>FIELD QUEUE</p>
          <h1 className={todayPageStyles.title}>Today</h1>
          <p className={todayPageStyles.subtitle}>{page.taskCountLabel}</p>
        </div>
      </header>

      {page.hasQueryError ? (
        <QueryErrorAlert
          error={page.queryError}
          fallback="Could not load assigned tasks."
        />
      ) : null}

      {page.shiftSummary.data ? (
        <ShiftSummaryCard summary={page.shiftSummary.data} />
      ) : null}

      <div className={todayPageStyles.grid}>
        <section className={todayPageStyles.section}>
          <div className={todayPageStyles.sectionHeader}>
            <h2 className={todayPageStyles.sectionTitle}>Deliveries</h2>
            <span className={todayPageStyles.sectionCount}>
              {page.deliveryCount} active
            </span>
          </div>
          {page.deliveries.isLoading ? (
            <p className={todayPageStyles.loadingText}>Loading deliveries...</p>
          ) : page.deliveryCount > 0 && page.deliveries.data ? (
            <TodayDeliveriesList shipments={page.deliveries.data} />
          ) : (
            <p className={todayPageStyles.emptyText}>No active deliveries.</p>
          )}
        </section>

        <section className={todayPageStyles.section}>
          <div className={todayPageStyles.sectionHeader}>
            <h2 className={todayPageStyles.sectionTitle}>Return pickups</h2>
            <span className={todayPageStyles.sectionCount}>
              {page.pickupCount} scheduled
            </span>
          </div>
          {page.pickups.isLoading ? (
            <p className={todayPageStyles.loadingText}>Loading pickups...</p>
          ) : page.pickupCount > 0 && page.pickups.data ? (
            <TodayPickupsList pickups={page.pickups.data} />
          ) : (
            <p className={todayPageStyles.emptyText}>No scheduled pickups.</p>
          )}
        </section>
      </div>
    </div>
  );
}

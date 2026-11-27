"use client";

import { Undo2 } from "lucide-react";
import { DataTable } from "@/shared/components/DataTable";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import type { RtoQueueShipment } from "../../../api/shipping/shipping.api";
import { rtoQueuePanelStyles as styles } from "../../../styles/shipping/rtoQueuePanel.styles";
import { useRtoQueuePanel } from "../../../hooks/shipping/useRtoQueuePanel.hook";

const getRowId = (row: RtoQueueShipment) => row.id;

/** Every shipment returning to origin or already received back, with search, filters, and the "received" action. */
export function RtoQueuePanel() {
  const {
    visible,
    filteredShipments,
    columns,
    renderActions,
    loading,
    pendingBadge,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    onClearFilters,
  } = useRtoQueuePanel();

  const activeCount =
    (search.trim() ? 1 : 0) + (statusFilter !== "ALL" ? 1 : 0);

  if (!visible) return null;

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Undo2 className={styles.headerIcon} aria-hidden="true" />
          <h2 className={styles.title}>{LABELS.rtoQueueTitle}</h2>
        </div>
        {pendingBadge ? (
          <span className={styles.badge}>{pendingBadge}</span>
        ) : null}
      </div>

      <CollapsibleTableFilters
        activeCount={activeCount}
        onClear={onClearFilters}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame label={LABELS.search} htmlFor="rto-filter-search">
            <SearchInput
              id="rto-filter-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              placeholder="Search by tracking #, customer, order ID, or reason..."
            />
          </FormFieldFrame>

          <FormFieldFrame label={LABELS.status} htmlFor="rto-filter-status">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="rto-filter-status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="RTO_INITIATED">RTO Initiated</SelectItem>
                <SelectItem value="RTO_DELIVERED">RTO Delivered</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </div>
      </CollapsibleTableFilters>

      <DataTable
        ariaLabel={LABELS.rtoQueueTableAria}
        columns={columns}
        rows={filteredShipments}
        actions={renderActions}
        getRowId={getRowId}
        loading={loading}
        emptyMessage={LABELS.rtoQueueEmpty}
        rowDetails
        showViewButton
        tableId="admin-rto-queue"
        enableColumnVisibility
        enableDensityToggle
        enableExport
        enableSorting
        enableFullscreen
      />
    </section>
  );
}

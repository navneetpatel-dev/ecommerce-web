"use client";

import { CollapsibleTableFilters } from "@/shared/components/filters";
import { ticketFiltersStyles } from "../../../styles/filters/ticketFilters.styles";
import { useTicketFiltersHandlers } from "../../../hooks/filters/useTicketFiltersHandlers.hook";
import { TicketStatusFilterSelect } from "./TicketStatusFilterSelect.component";
import { TicketPriorityFilterSelect } from "./TicketPriorityFilterSelect.component";
import { TicketCategoryFilterSelect } from "./TicketCategoryFilterSelect.component";
import { TicketVendorFilterSelect } from "./TicketVendorFilterSelect.component";

interface TicketFiltersProps {
  showVendorId?: boolean;
}

export function TicketFilters({ showVendorId = true }: TicketFiltersProps) {
  const {
    currentStatus,
    currentPriority,
    currentCategory,
    currentVendorId,
    handleStatusChange,
    handlePriorityChange,
    handleCategoryChange,
    handleVendorChange,
    fetchVendorPage,
  } = useTicketFiltersHandlers();

  const activeCount =
    (currentStatus ? 1 : 0) +
    (currentPriority ? 1 : 0) +
    (currentCategory ? 1 : 0) +
    (currentVendorId ? 1 : 0);

  return (
    <CollapsibleTableFilters activeCount={activeCount}>
      <div className={ticketFiltersStyles.container(showVendorId)}>
        <TicketStatusFilterSelect
          value={currentStatus}
          onChange={handleStatusChange}
        />
        <TicketPriorityFilterSelect
          value={currentPriority}
          onChange={handlePriorityChange}
        />
        <TicketCategoryFilterSelect
          value={currentCategory}
          onChange={handleCategoryChange}
        />
        {showVendorId ? (
          <TicketVendorFilterSelect
            value={currentVendorId}
            onChange={handleVendorChange}
            fetchPage={fetchVendorPage}
          />
        ) : null}
      </div>
    </CollapsibleTableFilters>
  );
}

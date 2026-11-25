"use client";

import { useEffect, useState } from "react";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { FormFieldFrame } from "@/shared/components/forms";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import { LABELS } from "@/shared/constants/labels";
import { useDebouncedCallback } from "@/shared/hooks/ui/use-debounce.hook";
import {
  useTicketFiltersHandlers,
  ALL,
} from "../../../hooks/filters/useTicketFiltersHandlers.hook";
import { TicketStatusFilterSelect } from "./TicketStatusFilterSelect.component";
import { TicketPriorityFilterSelect } from "./TicketPriorityFilterSelect.component";
import { TicketCategoryFilterSelect } from "./TicketCategoryFilterSelect.component";
import { TicketVendorFilterSelect } from "./TicketVendorFilterSelect.component";

interface TicketFiltersProps {
  showVendorId?: boolean;
}

export function TicketFilters({ showVendorId = true }: TicketFiltersProps) {
  const {
    currentSearch,
    currentStatus,
    currentPriority,
    currentCategory,
    currentVendorId,
    handleSearchChange,
    handleClear,
    handleStatusChange,
    handlePriorityChange,
    handleCategoryChange,
    handleVendorChange,
    fetchVendorPage,
  } = useTicketFiltersHandlers();

  const [searchDraft, setSearchDraft] = useState(currentSearch);
  useEffect(() => {
    setSearchDraft(currentSearch);
  }, [currentSearch]);
  const debouncedSearch = useDebouncedCallback(handleSearchChange, 350);

  const activeCount =
    (searchDraft.trim() ? 1 : 0) +
    (currentStatus && currentStatus !== ALL ? 1 : 0) +
    (currentPriority && currentPriority !== ALL ? 1 : 0) +
    (currentCategory && currentCategory !== ALL ? 1 : 0) +
    (currentVendorId ? 1 : 0);

  return (
    <CollapsibleTableFilters
      activeCount={activeCount}
      onClear={() => {
        setSearchDraft("");
        handleClear();
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <FormFieldFrame label={LABELS.search} htmlFor="ticket-filter-search">
          <SearchInput
            id="ticket-filter-search"
            value={searchDraft}
            onChange={(e) => {
              setSearchDraft(e.target.value);
              debouncedSearch(e.target.value);
            }}
            onClear={() => {
              setSearchDraft("");
              handleSearchChange("");
            }}
            placeholder="Search by subject or TCKT-#"
          />
        </FormFieldFrame>
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

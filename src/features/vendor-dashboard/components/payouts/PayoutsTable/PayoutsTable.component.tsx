"use client";

import { useState, useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { PayoutEntry } from "@/shared/api/types";
import { payoutsTableStyles } from "../../../styles/payouts/payoutsTable.styles";
import { usePayoutsTablePresentation } from "../../../hooks/payouts/usePayoutsTablePresentation.hook";
import { PayoutMobileList } from "./PayoutMobileList.component";
import { PayoutDesktopTable } from "./PayoutDesktopTable.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";

interface PayoutsTableProps {
  payouts?: { items?: PayoutEntry[] };
}

export function PayoutsTable({ payouts }: PayoutsTableProps) {
  const { isEmpty, rows } = usePayoutsTablePresentation(payouts);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const match =
          r.id.toLowerCase().includes(q) ||
          r.periodLabel.toLowerCase().includes(q) ||
          r.detailsLabel.toLowerCase().includes(q) ||
          r.amountLabel.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (status && r.status !== status) return false;
      return true;
    });
  }, [rows, search, status]);

  const hasFilters = Boolean(search || status);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
        <h2 className={payoutsTableStyles.title}>{LABELS.payouts}</h2>
      </div>
      {!isEmpty && (
        <CollapsibleTableFilters
          activeCount={(search ? 1 : 0) + (status ? 1 : 0)}
          onClear={() => {
            setSearch("");
            setStatus("");
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
            <FormFieldFrame
              label={LABELS.search}
              htmlFor="vendor-payouts-filter-search"
            >
              <Input
                id="vendor-payouts-filter-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search payouts by ID, ref, period..."
              />
            </FormFieldFrame>

            <FormFieldFrame
              label={LABELS.status}
              htmlFor="vendor-payouts-filter-status"
            >
              <Select
                value={status || "__ALL__"}
                onValueChange={(val) => setStatus(val === "__ALL__" ? "" : val)}
              >
                <SelectTrigger id="vendor-payouts-filter-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">All Statuses</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldFrame>

            {hasFilters && (
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setStatus("");
                  }}
                >
                  {LABELS.clearFilters}
                </Button>
              </div>
            )}
          </div>
        </CollapsibleTableFilters>
      )}
      <PayoutMobileList
        rows={filteredRows}
        isEmpty={isEmpty || filteredRows.length === 0}
      />
      <PayoutDesktopTable
        rows={filteredRows}
        isEmpty={isEmpty || filteredRows.length === 0}
      />
    </div>
  );
}

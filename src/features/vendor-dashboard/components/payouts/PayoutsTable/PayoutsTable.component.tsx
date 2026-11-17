"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
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
        {!isEmpty && (
          <div className="flex flex-1 max-w-lg items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search payouts by ID, ref, period..."
                className="pl-8 h-8 text-xs"
              />
            </div>
            <div className="w-32">
              <Select
                value={status || "__ALL__"}
                onValueChange={(val) => setStatus(val === "__ALL__" ? "" : val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">All Statuses</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
                className="h-8 px-2 text-xs"
              >
                <X className="size-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        )}
      </div>
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

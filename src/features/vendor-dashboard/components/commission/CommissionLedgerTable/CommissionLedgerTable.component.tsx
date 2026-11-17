"use client";

import { useState, useMemo } from "react";
import { commissionLedgerTableStyles } from "../../../styles/commission/commissionLedgerTable.styles";
import {
  useCommissionLedgerPresentation,
  type Commission,
} from "../../../hooks/commission/useCommissionLedgerPresentation.hook";
import { CommissionMobileList } from "./CommissionMobileList.component";
import { CommissionDesktopTable } from "./CommissionDesktopTable.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";

interface CommissionLedgerTableProps {
  commissions?: { items?: Commission[] };
}

export function CommissionLedgerTable({
  commissions,
}: CommissionLedgerTableProps) {
  const { isEmpty, rows } = useCommissionLedgerPresentation(commissions);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesDate = r.dateLabel.toLowerCase().includes(q);
        const matchesSale = r.saleAmountLabel.toLowerCase().includes(q);
        const matchesComm = r.commissionAmountLabel.toLowerCase().includes(q);
        if (!matchesId && !matchesDate && !matchesSale && !matchesComm) {
          return false;
        }
      }
      if (status && r.status !== status) {
        return false;
      }
      return true;
    });
  }, [rows, search, status]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(rows.map((r) => r.status).filter(Boolean)));
  }, [rows]);

  const activeCount = (search.trim() ? 1 : 0) + (status ? 1 : 0);

  const handleClear = () => {
    setSearch("");
    setStatus("");
  };

  return (
    <div>
      <h2 className={commissionLedgerTableStyles.title}>Commission Ledger</h2>

      {!isEmpty && (
        <div className="mb-4">
          <CollapsibleTableFilters
            activeCount={activeCount}
            onClear={handleClear}
          >
            <div className="flex flex-wrap items-end gap-3">
              <FormFieldFrame
                label={LABELS.search ?? "Search"}
                htmlFor="commission-ledger-search"
                className="w-64"
              >
                <Input
                  id="commission-ledger-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ledger by date, amount, ID..."
                />
              </FormFieldFrame>

              {uniqueStatuses.length > 0 && (
                <FormFieldFrame
                  label="Status"
                  htmlFor="commission-ledger-status"
                  className="w-40"
                >
                  <Select
                    value={status}
                    onValueChange={(val) => setStatus(val === "ALL" ? "" : val)}
                  >
                    <SelectTrigger id="commission-ledger-status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All statuses</SelectItem>
                      {uniqueStatuses.map((st) => (
                        <SelectItem key={st} value={st}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormFieldFrame>
              )}
            </div>
          </CollapsibleTableFilters>
        </div>
      )}

      <CommissionMobileList
        rows={filteredRows}
        isEmpty={isEmpty || filteredRows.length === 0}
      />
      <CommissionDesktopTable
        rows={filteredRows}
        isEmpty={isEmpty || filteredRows.length === 0}
      />
    </div>
  );
}

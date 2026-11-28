"use client";

import { useMemo, useState } from "react";
import type { WalletTransaction } from "@/shared/api/types";

/** Searching the loaded wallet transactions and narrowing them to credits or debits. */
export function useWalletTransactionFilters(transactions: WalletTransaction[]) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const desc = (t.description ?? "").toLowerCase();
        const refType = (t.referenceType ?? "").toLowerCase();
        const refId = (t.referenceId ?? "").toLowerCase();
        if (!desc.includes(q) && !refType.includes(q) && !refId.includes(q)) {
          return false;
        }
      }
      if (type && t.type !== type) return false;
      return true;
    });
  }, [transactions, search, type]);

  const activeCount = (search.trim() ? 1 : 0) + (type ? 1 : 0);
  const handleClear = () => {
    setSearch("");
    setType("");
  };

  return {
    search,
    setSearch,
    type,
    setType,
    activeCount,
    handleClear,
    filteredTransactions,
  };
}

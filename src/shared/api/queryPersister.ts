import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";

/**
 * IndexedDB-backed persister for the TanStack Query cache (performance
 * standard §11). Only non-sensitive, non-rapidly-stale content queries are
 * dehydrated (filter lives in app/providers.tsx) — never auth/session/cart
 * data, since tokens/PII must not persist. Restored entries are treated as
 * stale-by-default: they refetch in the background per their staleTime.
 */
const storage = {
  getItem: (key: string) => get(key),
  setItem: (key: string, value: unknown) => set(key, value),
  removeItem: (key: string) => del(key),
};

export function createQueryPersister() {
  return createAsyncStoragePersister({
    storage,
    key: "ecommerce-query-cache",
    throttleTime: 5_000,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });
}

import type {
  RowActionEntry,
  RowActionRegistry,
} from "../../types/data-table/rowActions.types";

function byDocumentOrder(a: RowActionEntry, b: RowActionEntry): number {
  const position = a.marker.compareDocumentPosition(b.marker);
  return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/** Per-menu store of the actions currently rendered for one row. */
export function createRowActionRegistry(): RowActionRegistry {
  const entries = new Map<string, RowActionEntry>();
  const listeners = new Set<() => void>();
  let snapshot: RowActionEntry[] = [];

  const publish = () => {
    snapshot = [...entries.values()].sort(byDocumentOrder);
    listeners.forEach((listener) => listener());
  };

  return {
    upsert(entry) {
      entries.set(entry.id, entry);
      publish();
    },
    remove(id) {
      if (entries.delete(id)) publish();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snapshot,
  };
}

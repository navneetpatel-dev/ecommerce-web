import { useState, useCallback, useRef } from "react";
import { toDetailRecord } from "../utils.component";

interface UseRowDetailFetcherOptions<T> {
  fetchRowDetail?: (row: T) => Promise<Record<string, unknown>>;
  getRowId?: (row: T, index: number) => string;
}

export function useRowDetailFetcher<T>({
  fetchRowDetail,
  getRowId,
}: UseRowDetailFetcherOptions<T>) {
  const [detailRow, setDetailRow] = useState<T | null>(null);
  const [detailRecord, setDetailRecord] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, Record<string, unknown>>>(new Map());

  const openRow = useCallback(
    (row: T, index: number) => {
      setDetailRow(row);
      setError(null);

      if (!fetchRowDetail) {
        setDetailRecord(toDetailRecord(row));
        setIsLoading(false);
        return;
      }

      const rowKey = getRowId
        ? getRowId(row, index)
        : (row as { id?: string | number })?.id != null
          ? String((row as { id: string | number }).id)
          : null;

      if (rowKey && cacheRef.current.has(rowKey)) {
        setDetailRecord(cacheRef.current.get(rowKey)!);
        setIsLoading(false);
        return;
      }

      setDetailRecord(toDetailRecord(row));
      setIsLoading(true);

      fetchRowDetail(row)
        .then((fullRecord) => {
          if (rowKey) {
            cacheRef.current.set(rowKey, fullRecord);
          }
          setDetailRecord(fullRecord);
          setIsLoading(false);
        })
        .catch((err: unknown) => {
          setError(
            err instanceof Error ? err.message : "Failed to load details",
          );
          setIsLoading(false);
        });
    },
    [fetchRowDetail, getRowId],
  );

  const close = useCallback(() => {
    setDetailRow(null);
    setDetailRecord(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    detailRow,
    detailRecord,
    isLoading,
    error,
    openRow,
    close,
  };
}

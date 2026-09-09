"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { QUERY_FLAG, QUERY_PARAMS } from "@/shared/constants/navigation/queryParams";
import { replaceRouteQuery } from "@/shared/utils/navigation/routeQuery";

export type RouteQueryDialogMode = "create" | "edit";

interface UseRouteQueryDialogOptions {
  createParam?: string;
  editParam?: string;
}

/** Sync create/edit dialog visibility with URL query params (?create=1, ?edit=<id>). */
export function useRouteQueryDialog(options: UseRouteQueryDialogOptions = {}) {
  const createParam = options.createParam ?? QUERY_PARAMS.create;
  const editParam = options.editParam ?? QUERY_PARAMS.edit;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const editId = searchParams.get(editParam);
  const isCreate = searchParams.get(createParam) === QUERY_FLAG;
  const mode: RouteQueryDialogMode | null = editId
    ? "edit"
    : isCreate
      ? "create"
      : null;
  const open = mode !== null;

  const setQuery = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      router.replace(replaceRouteQuery(pathname, searchParams, updates), {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const openCreate = useCallback(() => {
    setQuery({ [createParam]: QUERY_FLAG, [editParam]: null });
  }, [createParam, editParam, setQuery]);

  const openEdit = useCallback(
    (id: string) => {
      setQuery({ [editParam]: id, [createParam]: null });
    },
    [createParam, editParam, setQuery],
  );

  const close = useCallback(() => {
    setQuery({ [createParam]: null, [editParam]: null });
  }, [createParam, editParam, setQuery]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!next) close();
    },
    [close],
  );

  return {
    open,
    mode,
    editId,
    openCreate,
    openEdit,
    close,
    setOpen,
    setQuery,
  };
}

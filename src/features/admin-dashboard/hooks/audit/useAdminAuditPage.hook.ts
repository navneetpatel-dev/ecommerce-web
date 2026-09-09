"use client";

import { useCallback, useState } from "react";
import { auditApi } from "../../api/audit/audit.api";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { AUDIT_ENTITY_TYPES } from "@/shared/constants/labels/auditFilters";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export type AdminAuditPageModel = AdminListPageModel & {
  filters: {
    entityType: string;
    actor: string;
    from: string;
    to: string;
    entityTypes: readonly string[];
    onEntityTypeChange: (value: string) => void;
    onActorChange: (value: string) => void;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
    onClear: () => void;
  };
};

export function useAdminAuditPage(): AdminAuditPageModel {
  const [entityType, setEntityType] = useState("");
  const [actor, setActor] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const debouncedActor = useDebouncedValue(actor.trim(), 400);

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      auditApi.list({
        page,
        limit,
        entityType: entityType || undefined,
        actor: debouncedActor || undefined,
        from: from || undefined,
        to: to || undefined,
      }),
    [entityType, debouncedActor, from, to],
  );

  const onClear = useCallback(() => {
    setEntityType("");
    setActor("");
    setFrom("");
    setTo("");
  }, []);

  return {
    title: LABELS.audit,
    permission: PERMISSIONS.AUDIT_VIEW,
    load,
    columnKeys: ["actorName", "action", "entityType", "createdAt"],
    filters: {
      entityType,
      actor,
      from,
      to,
      entityTypes: AUDIT_ENTITY_TYPES,
      onEntityTypeChange: setEntityType,
      onActorChange: setActor,
      onFromChange: setFrom,
      onToChange: setTo,
      onClear,
    },
  };
}

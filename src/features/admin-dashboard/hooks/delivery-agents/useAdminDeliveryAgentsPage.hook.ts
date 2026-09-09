"use client";

import { useCallback, useState } from "react";
import {
  deliveryAdminApi,
  type DeliveryAgent,
} from "@/features/delivery-dashboard";
import type {
  AdminDataRow,
  AdminListLoadFn,
} from "../shared/useAdminDataList.hook";

export function nextAgentStatus(status: string) {
  const isSuspended = status === "SUSPENDED";
  return {
    isSuspended,
    actionLabel: isSuspended ? "Reactivate" : "Suspend",
    actionTitle: isSuspended ? "Reactivate this agent?" : "Suspend this agent?",
    nextStatus: isSuspended ? "ACTIVE" : "SUSPENDED",
  } as const;
}

export function useAdminDeliveryAgentsPage() {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [revision, setRevision] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadAgents = useCallback<AdminListLoadFn>(async (params) => {
    const result = await deliveryAdminApi.list({
      page: params.page,
      limit: params.limit,
    });
    setAgents(result.items);
    return result;
  }, []);

  const refresh = () => setRevision((value) => value + 1);

  const toggleCreateForm = () => setShowCreateForm((prev) => !prev);

  const handleCreated = () => {
    setShowCreateForm(false);
    refresh();
  };

  const handleAgentStatusConfirm = (row: AdminDataRow, reload: () => void) => {
    const { nextStatus } = nextAgentStatus(String(row.status));
    return deliveryAdminApi
      .update(String(row.id), { status: nextStatus })
      .then(() => {
        reload();
        refresh();
      });
  };

  return {
    agents,
    revision,
    showCreateForm,
    loadAgents,
    refresh,
    toggleCreateForm,
    handleCreated,
    closeCreateForm: () => setShowCreateForm(false),
    handleAgentStatusConfirm,
    createAgentButtonVariant: showCreateForm
      ? ("outline" as const)
      : ("default" as const),
    createAgentButtonLabel: showCreateForm ? "Close form" : "Create agent",
  };
}

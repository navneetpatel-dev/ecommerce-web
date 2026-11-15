"use client";

import { useState, useCallback, useEffect } from "react";
import {
  vendorStaffApi,
  type StaffMember,
  type AddStaffPayload,
} from "../../api/vendorStaff.api";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

export function useVendorTeam() {
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] =
    useState<StaffMember | null>(null);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorStaffApi.list();
      setMembers(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load team members"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void vendorStaffApi
      .list()
      .then((data) => {
        if (!cancelled) {
          setMembers(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Failed to load team members"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addStaff = useCallback(
    async (payload: AddStaffPayload) => {
      setIsSubmitting(true);
      setActionError(null);
      try {
        await vendorStaffApi.add(payload);
        await fetchStaff();
        return true;
      } catch (err) {
        setActionError(getApiErrorMessage(err, "Failed to add team member"));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchStaff],
  );

  const removeStaff = useCallback(
    async (userId: string) => {
      setIsSubmitting(true);
      setActionError(null);
      try {
        await vendorStaffApi.remove(userId);
        await fetchStaff();
        return true;
      } catch (err) {
        setActionError(getApiErrorMessage(err, "Failed to remove team member"));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchStaff],
  );

  const handleOpenAdd = useCallback(() => {
    setActionError(null);
    setAddOpen(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setAddOpen(false);
  }, []);

  const handleOpenRemove = useCallback((member: StaffMember) => {
    setActionError(null);
    setSelectedForRemoval(member);
  }, []);

  const handleCloseRemove = useCallback(() => {
    setSelectedForRemoval(null);
  }, []);

  const handleConfirmRemove = useCallback(async () => {
    if (!selectedForRemoval) return false;
    const ok = await removeStaff(selectedForRemoval.id);
    if (ok) setSelectedForRemoval(null);
    return ok;
  }, [selectedForRemoval, removeStaff]);

  return {
    members,
    isLoading,
    error,
    actionError,
    setActionError,
    isSubmitting,
    refresh: fetchStaff,
    addStaff,
    removeStaff,
    addOpen,
    setAddOpen,
    selectedForRemoval,
    handleOpenAdd,
    handleCloseAdd,
    handleOpenRemove,
    handleCloseRemove,
    handleConfirmRemove,
  };
}

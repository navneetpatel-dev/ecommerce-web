"use client";

import { useState, useCallback, type FormEvent, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { adminShippingApi } from "@/features/admin-dashboard/api/shipping/shipping.api";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { AdminEditShippingZoneAction } from "../../components/shipping/AdminEditShippingZoneAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import { parseCsv } from "../../utils/shipping/csvField";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export type AdminShippingPageModel = AdminListPageModel & {
  form: {
    name: string;
    states: string;
    pincodePrefixes: string;
    createError: string | null;
    onNameChange: (value: string) => void;
    onStatesChange: (value: string) => void;
    onPincodePrefixesChange: (value: string) => void;
    onSubmit: (e: FormEvent) => Promise<void>;
  };
};

export function useAdminShippingPage(): AdminShippingPageModel {
  const [name, setName] = useState("");
  const [states, setStates] = useState("");
  const [pincodePrefixes, setPincodePrefixes] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [listVersion, setListVersion] = useState(0);

  const handleCreate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;
      setCreateError(null);
      try {
        await adminShippingApi.createZone({
          name: name.trim(),
          states: parseCsv(states),
          pincodePrefixes: parseCsv(pincodePrefixes),
        });
        setName("");
        setStates("");
        setPincodePrefixes("");
        setListVersion((version) => version + 1);
      } catch (err) {
        setCreateError(
          getApiErrorMessage(err, LABELS.couldNotCreateShippingZone),
        );
      }
    },
    [name, states, pincodePrefixes],
  );

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion;
      return adminShippingApi.zones({ page, limit });
    },
    [listVersion],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const label = adminRowLabel(row);
      return (
        <>
          <AdminEditShippingZoneAction row={row} onSaved={reload} />
          <AdminConfirmAction
            label={LABELS.delete}
            dialogVariant="danger"
            title={LABELS.confirmDeleteShippingTitle}
            description={formatLabel(LABELS.confirmDeleteShippingBody, {
              name: label,
            })}
            onConfirm={() =>
              adminShippingApi.deleteZone(String(row.id)).then(reload)
            }
          />
        </>
      );
    },
    [],
  );

  return {
    form: {
      name,
      states,
      pincodePrefixes,
      createError,
      onNameChange: setName,
      onStatesChange: setStates,
      onPincodePrefixesChange: setPincodePrefixes,
      onSubmit: handleCreate,
    },
    title: LABELS.shipping,
    permission: PERMISSIONS.SHIPPING_MANAGE,
    load,
    actions,
    columnKeys: ["name", "states", "pincodePrefixes"],
  };
}

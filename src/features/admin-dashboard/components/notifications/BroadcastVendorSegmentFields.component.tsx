"use client";

import { useCallback } from "react";
import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  notificationsApi,
  type BroadcastCategoryOption,
} from "../../api/notifications/notifications.api";
import type { BroadcastBuilderState } from "../../hooks/notifications/broadcastBuilder.types";
import { InfiniteSearchSelect } from "./InfiniteSearchSelect.component";

interface BroadcastVendorSegmentFieldsProps {
  state: BroadcastBuilderState;
  patch: (partial: Partial<BroadcastBuilderState>) => void;
}

export function BroadcastVendorSegmentFields({
  state,
  patch,
}: BroadcastVendorSegmentFieldsProps) {
  const loadCategories = useCallback(
    (q: string, page: number) =>
      notificationsApi.searchBroadcastCategories(q, page, 20),
    [],
  );
  const loadStates = useCallback(
    (q: string, page: number) =>
      notificationsApi.searchBroadcastLocations("state", q, page, 20),
    [],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormFieldFrame label="Vendor status" htmlFor="v-status">
          <Select
            value={state.vendorSegment.vendorStatus ?? "__ALL__"}
            onValueChange={(v) =>
              patch({
                vendorSegment: {
                  ...state.vendorSegment,
                  vendorStatus:
                    v === "__ALL__"
                      ? undefined
                      : (v as "APPROVED" | "PENDING" | "SUSPENDED"),
                },
              })
            }
          >
            <SelectTrigger id="v-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">All statuses</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame label="KYC verified" htmlFor="v-kyc">
          <Select
            value={
              state.vendorSegment.kycVerified === undefined
                ? "__ALL__"
                : String(state.vendorSegment.kycVerified)
            }
            onValueChange={(v) =>
              patch({
                vendorSegment: {
                  ...state.vendorSegment,
                  kycVerified: v === "__ALL__" ? undefined : v === "true",
                },
              })
            }
          >
            <SelectTrigger id="v-kyc">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">Any</SelectItem>
              <SelectItem value="true">KYC Verified</SelectItem>
              <SelectItem value="false">KYC Pending</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame label="Min score (0–5)" htmlFor="v-score">
          <Input
            id="v-score"
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={state.vendorSegment.minPerformanceScore ?? ""}
            onChange={(e) =>
              patch({
                vendorSegment: {
                  ...state.vendorSegment,
                  minPerformanceScore: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                },
              })
            }
            placeholder="e.g. 4.0"
          />
        </FormFieldFrame>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormFieldFrame label="Vendor categories" htmlFor="v-categories">
          <InfiniteSearchSelect<BroadcastCategoryOption>
            placeholder="Search categories..."
            loadPage={loadCategories}
            getId={(c) => c.id}
            getLabel={(c) => c.name}
            getSubLabel={(c) => c.slug}
            selected={state.selectedCategories}
            multiple
            onChange={(selectedCategories) => patch({ selectedCategories })}
          />
        </FormFieldFrame>
        <FormFieldFrame label="Vendor state" htmlFor="v-state">
          <InfiniteSearchSelect<string>
            placeholder="Select state..."
            loadPage={loadStates}
            getId={(s) => s}
            getLabel={(s) => s}
            selected={
              state.vendorSegment.state ? [state.vendorSegment.state] : []
            }
            multiple={false}
            onChange={(next) =>
              patch({
                vendorSegment: {
                  ...state.vendorSegment,
                  state: next[0] ?? undefined,
                },
              })
            }
          />
        </FormFieldFrame>
      </div>
    </div>
  );
}

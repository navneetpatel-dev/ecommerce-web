"use client";

import { useCallback } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { notificationsApi } from "../../api/notifications/notifications.api";
import type { BroadcastBuilderState } from "../../hooks/notifications/broadcastBuilder.types";
import { BroadcastVendorSegmentFields } from "./BroadcastVendorSegmentFields.component";
import { InfiniteSearchSelect } from "./InfiniteSearchSelect.component";

interface BroadcastSegmentFieldsProps {
  mode: "user_segment" | "vendor_segment";
  state: BroadcastBuilderState;
  patch: (partial: Partial<BroadcastBuilderState>) => void;
}

export function BroadcastSegmentFields({
  mode,
  state,
  patch,
}: BroadcastSegmentFieldsProps) {
  const loadStates = useCallback(
    (q: string, page: number) =>
      notificationsApi.searchBroadcastLocations("state", q, page, 20),
    [],
  );
  const loadCities = useCallback(
    (q: string, page: number) =>
      notificationsApi.searchBroadcastLocations("city", q, page, 20),
    [],
  );

  if (mode === "vendor_segment") {
    return <BroadcastVendorSegmentFields state={state} patch={patch} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <FormFieldFrame label="Account status" htmlFor="seg-status">
        <Select
          value={state.userSegment.status ?? "ACTIVE"}
          onValueChange={(v) =>
            patch({
              userSegment: {
                ...state.userSegment,
                status: v as "ACTIVE" | "BLOCKED" | "ALL",
              },
            })
          }
        >
          <SelectTrigger id="seg-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active only</SelectItem>
            <SelectItem value="BLOCKED">Blocked only</SelectItem>
            <SelectItem value="ALL">All statuses</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label="Order activity" htmlFor="seg-activity">
        <Select
          value={state.userSegment.activity ?? "__ALL__"}
          onValueChange={(v) =>
            patch({
              userSegment: {
                ...state.userSegment,
                activity:
                  v === "__ALL__"
                    ? undefined
                    : (v as NonNullable<
                        BroadcastBuilderState["userSegment"]["activity"]
                      >),
              },
            })
          }
        >
          <SelectTrigger id="seg-activity">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Any activity</SelectItem>
            <SelectItem value="ordered_last_30d">
              Ordered in last 30d
            </SelectItem>
            <SelectItem value="repeat_buyers">
              Repeat buyers (2+ orders)
            </SelectItem>
            <SelectItem value="inactive_30d">Inactive 30+ days</SelectItem>
            <SelectItem value="inactive_90d">Inactive 90+ days</SelectItem>
            <SelectItem value="abandoned_cart">Has abandoned cart</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label="Email verified" htmlFor="seg-verified">
        <Select
          value={
            state.userSegment.emailVerified === undefined
              ? "__ALL__"
              : String(state.userSegment.emailVerified)
          }
          onValueChange={(v) =>
            patch({
              userSegment: {
                ...state.userSegment,
                emailVerified: v === "__ALL__" ? undefined : v === "true",
              },
            })
          }
        >
          <SelectTrigger id="seg-verified">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Any</SelectItem>
            <SelectItem value="true">Verified only</SelectItem>
            <SelectItem value="false">Unverified only</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label="Signed up within" htmlFor="seg-signup">
        <Select
          value={String(state.userSegment.signedUpWithinDays ?? "__ALL__")}
          onValueChange={(v) =>
            patch({
              userSegment: {
                ...state.userSegment,
                signedUpWithinDays: v === "__ALL__" ? undefined : Number(v),
              },
            })
          }
        >
          <SelectTrigger id="seg-signup">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Any time</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label="State / Region" htmlFor="seg-state">
        <InfiniteSearchSelect<string>
          placeholder="Select state..."
          loadPage={loadStates}
          getId={(s) => s}
          getLabel={(s) => s}
          selected={state.userSegment.state ? [state.userSegment.state] : []}
          multiple={false}
          onChange={(next) =>
            patch({
              userSegment: {
                ...state.userSegment,
                state: next[0] ?? undefined,
              },
            })
          }
        />
      </FormFieldFrame>
      <FormFieldFrame label="City" htmlFor="seg-city">
        <InfiniteSearchSelect<string>
          placeholder="Select city..."
          loadPage={loadCities}
          getId={(c) => c}
          getLabel={(c) => c}
          selected={state.userSegment.city ? [state.userSegment.city] : []}
          multiple={false}
          onChange={(next) =>
            patch({
              userSegment: {
                ...state.userSegment,
                city: next[0] ?? undefined,
              },
            })
          }
        />
      </FormFieldFrame>
    </div>
  );
}

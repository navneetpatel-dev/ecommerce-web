"use client";

import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { BroadcastBuilderState } from "../../hooks/notifications/broadcastBuilder.types";
import { BroadcastVendorSegmentFields } from "./BroadcastVendorSegmentFields.component";

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
  if (mode === "vendor_segment") {
    return <BroadcastVendorSegmentFields state={state} patch={patch} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        <Input
          id="seg-state"
          value={state.userSegment.state ?? ""}
          onChange={(e) =>
            patch({
              userSegment: {
                ...state.userSegment,
                state: e.target.value || undefined,
              },
            })
          }
          placeholder="e.g. Maharashtra"
        />
      </FormFieldFrame>
      <FormFieldFrame label="City" htmlFor="seg-city">
        <Input
          id="seg-city"
          value={state.userSegment.city ?? ""}
          onChange={(e) =>
            patch({
              userSegment: {
                ...state.userSegment,
                city: e.target.value || undefined,
              },
            })
          }
          placeholder="e.g. Bengaluru"
        />
      </FormFieldFrame>
    </div>
  );
}

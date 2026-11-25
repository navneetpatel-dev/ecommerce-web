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

interface BroadcastVendorSegmentFieldsProps {
  state: BroadcastBuilderState;
  patch: (partial: Partial<BroadcastBuilderState>) => void;
}

export function BroadcastVendorSegmentFields({
  state,
  patch,
}: BroadcastVendorSegmentFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
      <FormFieldFrame label="Vendor state" htmlFor="v-state">
        <Input
          id="v-state"
          value={state.vendorSegment.state ?? ""}
          onChange={(e) =>
            patch({
              vendorSegment: {
                ...state.vendorSegment,
                state: e.target.value || undefined,
              },
            })
          }
          placeholder="e.g. Gujarat"
        />
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
  );
}

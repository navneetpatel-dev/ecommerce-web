"use client";

import { useState } from "react";
import { Bike } from "lucide-react";
import { deliveryAdminApi } from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

import { BulkImportAgentsDialog } from "./BulkImportAgentsDialog.component";

const VEHICLE_TYPES = ["BIKE", "SCOOTER", "VAN", "BICYCLE"];

const emptyAgent = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
  vehicleType: "BIKE",
  hubOrZone: "",
};

export function CreateDeliveryAgentForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState(emptyAgent);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setPending(true);
    setError(null);
    try {
      await deliveryAdminApi.create(form);
      setForm(emptyAgent);
      onCreated();
    } catch (createError) {
      setError(
        getApiErrorMessage(
          createError,
          "Could not create this delivery agent.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-5">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2">
          <Bike className="size-5 text-brand" aria-hidden="true" />
          <h2 className="font-display text-[1.125rem] font-semibold text-ink">
            Create new delivery agent
          </h2>
        </div>
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-ink-muted hover:text-ink"
          >
            Cancel
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-caption font-medium text-ink-muted">
            Full name *
          </label>
          <Input
            placeholder="e.g. John Doe"
            value={form.fullName}
            onChange={(event) =>
              setForm({ ...form, fullName: event.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption font-medium text-ink-muted">
            Email address *
          </label>
          <Input
            type="email"
            placeholder="e.g. agent@example.com"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption font-medium text-ink-muted">
            Temporary password (min 8 chars) *
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption font-medium text-ink-muted">
            Phone number *
          </label>
          <Input
            placeholder="e.g. +91 9876543210"
            value={form.phone}
            onChange={(event) =>
              setForm({ ...form, phone: event.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption font-medium text-ink-muted">
            Hub or zone *
          </label>
          <Input
            placeholder="e.g. South Hub / Zone 110"
            value={form.hubOrZone}
            onChange={(event) =>
              setForm({ ...form, hubOrZone: event.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption font-medium text-ink-muted">
            Vehicle type
          </label>
          <Select
            value={form.vehicleType}
            onValueChange={(value) => setForm({ ...form, vehicleType: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-3">
        <div className="flex items-center gap-3">
          <Button
            loading={pending}
            disabled={
              !form.email ||
              form.password.length < 8 ||
              !form.fullName ||
              !form.phone ||
              !form.hubOrZone
            }
            onClick={() => void submit()}
          >
            Create agent
          </Button>
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={pending}
            >
              Cancel
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-caption font-medium text-ink-muted">
            Have multiple agents?
          </span>
          <BulkImportAgentsDialog onImported={onCreated} />
        </div>
      </div>

      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </section>
  );
}

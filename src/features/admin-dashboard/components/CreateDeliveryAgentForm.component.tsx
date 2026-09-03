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
}: {
  onCreated: () => void;
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
    <section className="border-y border-line py-5">
      <div className="mb-4 flex items-center gap-2">
        <Bike className="size-5 text-brand" aria-hidden="true" />
        <h2 className="font-display text-[1.125rem] text-ink">Create agent</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          placeholder="Full name"
          value={form.fullName}
          onChange={(event) =>
            setForm({ ...form, fullName: event.target.value })
          }
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <Input
          type="password"
          placeholder="Temporary password"
          value={form.password}
          onChange={(event) =>
            setForm({ ...form, password: event.target.value })
          }
        />
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
        <Input
          placeholder="Hub or zone"
          value={form.hubOrZone}
          onChange={(event) =>
            setForm({ ...form, hubOrZone: event.target.value })
          }
        />
        <Select
          value={form.vehicleType}
          onValueChange={(value) => setForm({ ...form, vehicleType: value })}
        >
          <SelectTrigger>
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
      <Button
        className="mt-4"
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
      {error ? <p className="mt-2 text-body-sm text-danger">{error}</p> : null}
    </section>
  );
}

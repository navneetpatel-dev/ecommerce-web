import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const VEHICLE_TYPES = ["BIKE", "SCOOTER", "VAN", "BICYCLE"];

export interface CreateDeliveryAgentFormValues {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  hubOrZone: string;
}

interface CreateDeliveryAgentFormFieldsProps {
  form: CreateDeliveryAgentFormValues;
  onChange: (next: CreateDeliveryAgentFormValues) => void;
}

/** The field grid (name/email/password/phone/hub/vehicle) for the create-agent form. */
export function CreateDeliveryAgentFormFields({
  form,
  onChange,
}: CreateDeliveryAgentFormFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-1.5">
        <label className="text-caption font-medium text-ink-muted">
          Full name *
        </label>
        <Input
          placeholder="e.g. John Doe"
          value={form.fullName}
          onChange={(event) =>
            onChange({ ...form, fullName: event.target.value })
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
          onChange={(event) => onChange({ ...form, email: event.target.value })}
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
            onChange({ ...form, password: event.target.value })
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
          onChange={(event) => onChange({ ...form, phone: event.target.value })}
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
            onChange({ ...form, hubOrZone: event.target.value })
          }
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-caption font-medium text-ink-muted">
          Vehicle type
        </label>
        <Select
          value={form.vehicleType}
          onValueChange={(value) => onChange({ ...form, vehicleType: value })}
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
  );
}

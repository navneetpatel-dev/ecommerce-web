import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { createDeliveryAgentFormStyles } from "./createDeliveryAgentForm.styles";
import type { CreateDeliveryAgentFormValues } from "./createDeliveryAgentForm.types";
import { useCreateDeliveryAgentFormFieldsHandlers } from "./useCreateDeliveryAgentFormFieldsHandlers.hook";
import { VehicleTypeOptionsList } from "./VehicleTypeOptionsList.component";

export type { CreateDeliveryAgentFormValues };

export interface CreateDeliveryAgentFormFieldsProps {
  form: CreateDeliveryAgentFormValues;
  onChange: (next: CreateDeliveryAgentFormValues) => void;
}

/** The field grid (name/email/password/phone/hub/vehicle) for the create-agent form. */
export function CreateDeliveryAgentFormFields({
  form,
  onChange,
}: CreateDeliveryAgentFormFieldsProps) {
  const {
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePhoneChange,
    handleHubOrZoneChange,
    handleVehicleTypeChange,
  } = useCreateDeliveryAgentFormFieldsHandlers(form, onChange);

  return (
    <div className={createDeliveryAgentFormStyles.grid}>
      <div className={createDeliveryAgentFormStyles.fieldWrapper}>
        <label className={createDeliveryAgentFormStyles.fieldLabel}>
          Full name *
        </label>
        <Input
          placeholder="e.g. John Doe"
          value={form.fullName}
          onChange={handleFullNameChange}
        />
      </div>

      <div className={createDeliveryAgentFormStyles.fieldWrapper}>
        <label className={createDeliveryAgentFormStyles.fieldLabel}>
          Email address *
        </label>
        <Input
          type="email"
          placeholder="e.g. agent@example.com"
          value={form.email}
          onChange={handleEmailChange}
        />
      </div>

      <div className={createDeliveryAgentFormStyles.fieldWrapper}>
        <label className={createDeliveryAgentFormStyles.fieldLabel}>
          Temporary password (min 8 chars) *
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handlePasswordChange}
        />
      </div>

      <div className={createDeliveryAgentFormStyles.fieldWrapper}>
        <label className={createDeliveryAgentFormStyles.fieldLabel}>
          Phone number *
        </label>
        <Input
          placeholder="e.g. +91 9876543210"
          value={form.phone}
          onChange={handlePhoneChange}
        />
      </div>

      <div className={createDeliveryAgentFormStyles.fieldWrapper}>
        <label className={createDeliveryAgentFormStyles.fieldLabel}>
          Hub or zone *
        </label>
        <Input
          placeholder="e.g. South Hub / Zone 110"
          value={form.hubOrZone}
          onChange={handleHubOrZoneChange}
        />
      </div>

      <div className={createDeliveryAgentFormStyles.fieldWrapper}>
        <label className={createDeliveryAgentFormStyles.fieldLabel}>
          Vehicle type
        </label>
        <Select
          value={form.vehicleType}
          onValueChange={handleVehicleTypeChange}
        >
          <SelectTrigger
            className={createDeliveryAgentFormStyles.selectTrigger}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <VehicleTypeOptionsList />
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

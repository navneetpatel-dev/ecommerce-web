import { SelectItem } from "@/shared/components/ui/select";

const VEHICLE_TYPES = ["BIKE", "SCOOTER", "VAN", "BICYCLE"] as const;

export function VehicleTypeOptionsList() {
  return (
    <>
      {VEHICLE_TYPES.map((value) => (
        <SelectItem key={value} value={value}>
          {value}
        </SelectItem>
      ))}
    </>
  );
}

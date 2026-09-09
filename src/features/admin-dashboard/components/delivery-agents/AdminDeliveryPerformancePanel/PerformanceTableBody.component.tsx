import type { DeliveryAgentPerformance } from "@/features/delivery-dashboard";
import { PerformanceTableRow } from "./PerformanceTableRow.component";

interface PerformanceTableBodyProps {
  rows: DeliveryAgentPerformance[];
}

export function PerformanceTableBody({ rows }: PerformanceTableBodyProps) {
  return (
    <tbody>
      {rows.map((row) => (
        <PerformanceTableRow key={row.deliveryAgentId} row={row} />
      ))}
    </tbody>
  );
}

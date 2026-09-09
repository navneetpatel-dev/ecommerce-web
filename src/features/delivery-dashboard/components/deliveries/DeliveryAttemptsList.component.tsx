import type { DeliveryShipment } from "../../types/agent/types";
import { DeliveryAttemptItem } from "./DeliveryAttemptsList/DeliveryAttemptItem.component";
import { ATTEMPTS_LIST_CONTAINER } from "./DeliveryAttemptsList/deliveryAttemptsList.styles";

interface DeliveryAttemptsListProps {
  attempts: NonNullable<DeliveryShipment["attempts"]>;
}

/** Prior failed-delivery attempts logged against this shipment. */
export function DeliveryAttemptsList({ attempts }: DeliveryAttemptsListProps) {
  return (
    <div className={ATTEMPTS_LIST_CONTAINER}>
      {attempts.map((attempt) => (
        <DeliveryAttemptItem key={attempt.id} attempt={attempt} />
      ))}
    </div>
  );
}

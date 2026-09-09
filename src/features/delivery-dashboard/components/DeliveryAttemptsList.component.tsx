import type { DeliveryShipment } from "../types";

interface DeliveryAttemptsListProps {
  attempts: NonNullable<DeliveryShipment["attempts"]>;
}

/** Prior failed-delivery attempts logged against this shipment. */
export function DeliveryAttemptsList({ attempts }: DeliveryAttemptsListProps) {
  return (
    <div className="space-y-2">
      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          className="border border-line bg-surface p-4 text-body-sm text-warning shadow-elevation-1"
        >
          <span className="font-medium">Attempt {attempt.attemptNumber}:</span>{" "}
          {attempt.note}
          {attempt.photoUrl ? (
            <a
              href={attempt.photoUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-2 font-medium text-brand hover:underline"
            >
              View photo
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}

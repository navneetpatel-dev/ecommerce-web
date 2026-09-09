import type { DeliveryShipment } from "../../../types/agent/types";
import {
  ATTEMPT_CARD,
  ATTEMPT_NUMBER_LABEL,
  ATTEMPT_PHOTO_LINK,
} from "./deliveryAttemptsList.styles";

type AttemptItemData = NonNullable<DeliveryShipment["attempts"]>[number];

interface DeliveryAttemptItemProps {
  attempt: AttemptItemData;
}

export function DeliveryAttemptItem({ attempt }: DeliveryAttemptItemProps) {
  return (
    <div className={ATTEMPT_CARD}>
      <span className={ATTEMPT_NUMBER_LABEL}>
        Attempt {attempt.attemptNumber}:
      </span>{" "}
      {attempt.note}
      {attempt.photoUrl ? (
        <a
          href={attempt.photoUrl}
          target="_blank"
          rel="noreferrer"
          className={ATTEMPT_PHOTO_LINK}
        >
          View photo
        </a>
      ) : null}
    </div>
  );
}

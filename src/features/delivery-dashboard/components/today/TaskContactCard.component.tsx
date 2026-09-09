import { ExternalLink, MapPin, MessageSquare, Phone, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { taskContactCardStyles as styles } from "../../styles/today/taskContactCard.styles";

export function TaskContactCard({
  name,
  phone,
  addressText,
  deliveryInstructions,
}: {
  name: string;
  phone?: string | null;
  addressText: string;
  deliveryInstructions?: string | null;
}) {
  const phoneLine = phone ? <p className={styles.phoneLine}>{phone}</p> : null;
  const deliveryInstructionsNotice = deliveryInstructions ? (
    <div className={styles.instructionsNotice}>
      <MessageSquare className={styles.instructionsIcon} aria-hidden="true" />
      <p className={styles.instructionsText}>{deliveryInstructions}</p>
    </div>
  ) : null;
  const callButton = phone ? (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={styles.fullWidthButton}
    >
      <a href={`tel:${phone}`}>
        <Phone className={styles.buttonIcon} aria-hidden="true" />
        Call customer
      </a>
    </Button>
  ) : null;
  const mapsButtonClassName = phone
    ? styles.fullWidthButton
    : styles.spanButton;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <MapPin className={styles.headerIcon} aria-hidden="true" />
        <TextEyebrow className={styles.eyebrow}>
          Recipient & Destination
        </TextEyebrow>
      </div>

      <div className={styles.body}>
        <div className={styles.customerRow}>
          <div className={styles.avatarCircle}>
            <User className={styles.avatarIcon} aria-hidden="true" />
          </div>
          <div className={styles.customerContent}>
            <p className={styles.captionLabel}>Customer</p>
            <p className={styles.customerName}>{name}</p>
            {phoneLine}
          </div>
        </div>

        <div className={styles.addressSection}>
          <p className={styles.captionLabel}>Delivery Address</p>
          <p className={styles.addressText}>{addressText}</p>
        </div>

        {deliveryInstructionsNotice}

        <div className={styles.actionsGrid}>
          {callButton}
          <Button
            asChild
            size="sm"
            variant="outline"
            className={mapsButtonClassName}
          >
            <a href={mapsHref} target="_blank" rel="noreferrer">
              <ExternalLink className={styles.buttonIcon} aria-hidden="true" />
              Open in Maps
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { ExternalLink } from "lucide-react";
import { TaskCard } from "../today/TaskCard.component";
import type { DeliveryStop } from "../../utils/deliveries/groupByStop";
import { googleMapsSearchUrl } from "../../utils/deliveries/mapsUrl";
import { PATHS } from "@/shared/constants/paths/paths";
import { deliveryListPageStyles as styles } from "../../pages/deliveries/deliveryListPage.styles";

interface DeliveryStopsListProps {
  stops: DeliveryStop[];
}

export function DeliveryStopsList({ stops }: DeliveryStopsListProps) {
  return (
    <div className={styles.grid}>
      {stops.map((stop) =>
        stop.shipments.length > 1 ? (
          <DeliveryStopGroup key={stop.key} stop={stop} />
        ) : (
          <TaskCard
            key={stop.shipments[0].id}
            href={PATHS.delivery.delivery(stop.shipments[0].id)}
            title={stop.shipments[0].trackingNumber}
            subtitle={stop.shipments[0].subOrder?.order?.shippingAddress?.city}
            status={stop.shipments[0].status}
          />
        ),
      )}
    </div>
  );
}

function DeliveryStopGroup({ stop }: { stop: DeliveryStop }) {
  const mapsHref = stop.addressText
    ? googleMapsSearchUrl(stop.addressText)
    : null;

  return (
    <div className={styles.stopCard}>
      <div className={styles.stopHeader}>
        <p className={styles.stopTitle}>
          {stop.shipments.length} packages to this address
        </p>
        {mapsHref ? (
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className={styles.mapLink}
          >
            <ExternalLink className={styles.mapIcon} aria-hidden="true" />
            Open in Maps
          </a>
        ) : null}
      </div>
      <div className={styles.stopList}>
        {stop.shipments.map((shipment) => (
          <TaskCard
            key={shipment.id}
            href={PATHS.delivery.delivery(shipment.id)}
            title={shipment.trackingNumber}
            subtitle={shipment.subOrder?.order?.shippingAddress?.city}
            status={shipment.status}
          />
        ))}
      </div>
    </div>
  );
}

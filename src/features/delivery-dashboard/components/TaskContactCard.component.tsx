import { MapPin, Phone } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function TaskContactCard({
  name,
  phone,
  addressText,
}: {
  name: string;
  phone?: string | null;
  addressText: string;
}) {
  return (
    <section className="border-y border-line py-5">
      <p className="font-medium text-ink">{name}</p>
      <p className="mt-1 text-body text-ink-muted">{addressText}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {phone ? (
          <Button asChild size="sm" variant="outline">
            <a href={`tel:${phone}`}>
              <Phone className="size-4" aria-hidden="true" />
              Call
            </a>
          </Button>
        ) : null}
        <Button asChild size="sm" variant="outline">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin className="size-4" aria-hidden="true" />
            Open map
          </a>
        </Button>
      </div>
    </section>
  );
}

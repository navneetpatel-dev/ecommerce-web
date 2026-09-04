import { ExternalLink, MapPin, MessageSquare, Phone, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

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
  return (
    <div className="border border-line bg-surface shadow-elevation-1">
      <div className="flex items-center gap-2 border-b border-line bg-paper/55 px-5 py-3.5">
        <MapPin className="size-4 text-brand" aria-hidden="true" />
        <TextEyebrow className="!mb-0">Recipient & Destination</TextEyebrow>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper/60 text-ink-muted">
            <User className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-caption font-semibold uppercase tracking-wider text-ink-muted">
              Customer
            </p>
            <p className="mt-0.5 truncate font-medium text-ink">{name}</p>
            {phone ? (
              <p className="text-body-sm text-ink-muted">{phone}</p>
            ) : null}
          </div>
        </div>

        <div className="border-t border-line/60 pt-3">
          <p className="text-caption font-semibold uppercase tracking-wider text-ink-muted">
            Delivery Address
          </p>
          <p className="mt-1 text-body-sm leading-relaxed text-ink">
            {addressText}
          </p>
        </div>

        {deliveryInstructions ? (
          <div className="flex items-start gap-2 rounded-md border border-line bg-warning/10 p-3">
            <MessageSquare
              className="mt-0.5 size-4 shrink-0 text-warning"
              aria-hidden="true"
            />
            <p className="text-body-sm leading-relaxed text-ink">
              {deliveryInstructions}
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
          {phone ? (
            <Button asChild size="sm" variant="outline" className="w-full">
              <a href={`tel:${phone}`}>
                <Phone className="size-3.5" aria-hidden="true" />
                Call customer
              </a>
            </Button>
          ) : null}
          <Button
            asChild
            size="sm"
            variant="outline"
            className={phone ? "w-full" : "col-span-full w-full"}
          >
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              Open in Maps
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Order } from "@/shared/api/types";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { PATHS } from "@/shared/constants/paths";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-body-sm text-ink-muted">
            Order #{order.id.slice(0, 8)}
          </span>
          <StatusBadge status={order.status} />
          <span className="text-body text-ink-muted">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <span className="font-mono font-bold">₹{order.totalAmount}</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {order.subOrders?.map((so) => (
            <div
              key={so.id}
              className="flex items-center justify-between text-body"
            >
              <div className="flex items-center gap-2">
                <VendorStrip vendor={so.vendor} size="sm" />
                <StatusBadge status={so.status} />
              </div>
              <Link
                href={PATHS.order(order.id)}
                className="text-brand hover:underline text-body-sm"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

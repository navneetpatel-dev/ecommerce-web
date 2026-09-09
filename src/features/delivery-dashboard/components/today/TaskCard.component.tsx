import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { taskCardStyles } from "../../styles/today/taskCard.styles";

export function TaskCard({
  href,
  title,
  subtitle,
  status,
}: {
  href: string;
  title: string;
  subtitle?: string | null;
  status: string;
}) {
  return (
    <Link href={href} className={taskCardStyles.card}>
      <MapPin className={taskCardStyles.icon} aria-hidden="true" />
      <div className={taskCardStyles.content}>
        <p className={taskCardStyles.title}>{title}</p>
        {subtitle ? (
          <p className={taskCardStyles.subtitle}>{subtitle}</p>
        ) : null}
      </div>
      <StatusBadge status={status} />
      <ChevronRight className={taskCardStyles.chevron} aria-hidden="true" />
    </Link>
  );
}

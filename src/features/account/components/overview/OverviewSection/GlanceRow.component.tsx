import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { glanceRowStyles as styles } from "./glanceRow.styles";

export interface GlanceRowProps {
  icon: typeof Package;
  label: string;
  value: string;
  href?: string;
  onDetails?: () => void;
}

export function GlanceRow({
  icon: Icon,
  label,
  value,
  href,
  onDetails,
}: GlanceRowProps) {
  const action = onDetails ? (
    <Button
      type="button"
      variant="link"
      size="sm"
      onClick={onDetails}
      className={styles.detailsButton}
    >
      {LABELS.details}
      <ChevronRight size={14} />
    </Button>
  ) : href ? (
    <Link href={href} className={styles.viewLink}>
      {LABELS.view}
      <ChevronRight size={14} />
    </Link>
  ) : null;

  return (
    <li className={styles.row}>
      <div className={styles.iconGroup}>
        <Icon size={16} strokeWidth={1.5} className={styles.icon} aria-hidden />
        <div className={styles.textContainer}>
          <p className={styles.label}>{label}</p>
          <p className={styles.value}>{value}</p>
        </div>
      </div>
      <div className={styles.actionContainer}>{action}</div>
    </li>
  );
}

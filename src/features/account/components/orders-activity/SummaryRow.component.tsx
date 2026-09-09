"use client";

import Link from "next/link";
import { ChevronRight, type Heart } from "lucide-react";
import { summaryRowStyles as styles } from "./summaryRow.styles";

interface SummaryRowProps {
  icon: typeof Heart;
  label: string;
  value: string;
  href?: string;
}

export function SummaryRow({
  icon: Icon,
  label,
  value,
  href,
}: SummaryRowProps) {
  const inner = (
    <>
      <span className={styles.iconWrapper}>
        <Icon size={16} strokeWidth={1.5} className={styles.icon} aria-hidden />
        <span className={styles.label}>{label}</span>
      </span>
      <span className={styles.valueGroup}>
        <span className={styles.valueText}>{value}</span>
        {href && <ChevronRight size={14} className={styles.chevron} />}
      </span>
    </>
  );

  if (href) {
    return (
      <li>
        <Link href={href} className={styles.link}>
          {inner}
        </Link>
      </li>
    );
  }

  return <li className={styles.row}>{inner}</li>;
}

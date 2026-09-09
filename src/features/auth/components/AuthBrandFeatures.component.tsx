import { Shield, Sparkles, Truck } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { authBrandVisualStyles as styles } from "./authBrandVisual.styles";

const FEATURES = [
  {
    icon: Sparkles,
    title: LABELS.authFeatureCurated,
    hint: LABELS.authFeatureCuratedHint,
  },
  {
    icon: Shield,
    title: LABELS.authFeatureSecure,
    hint: LABELS.authFeatureSecureHint,
  },
  {
    icon: Truck,
    title: LABELS.authFeatureDelivery,
    hint: LABELS.authFeatureDeliveryHint,
  },
] as const;

interface AuthBrandFeaturesProps {
  variant?: "list" | "pills";
  className?: string;
}

/** Trust highlights for auth marketing surfaces. */
export function AuthBrandFeatures({
  variant = "list",
  className,
}: AuthBrandFeaturesProps) {
  if (variant === "pills") {
    return (
      <ul className={cn(styles.pillsList, className)}>
        {FEATURES.map(({ icon: Icon, title }) => (
          <li key={title} className={styles.pillItem}>
            <Icon aria-hidden className={styles.pillIcon} strokeWidth={1.75} />
            {title}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={cn(styles.stackedList, className)}>
      {FEATURES.map(({ icon: Icon, title, hint }) => (
        <li key={title} className={styles.stackedItem}>
          <span className={styles.stackedIconWrapper}>
            <Icon
              aria-hidden
              className={styles.stackedIcon}
              strokeWidth={1.75}
            />
          </span>
          <span className={styles.stackedContent}>
            <span className={styles.stackedTitle}>{title}</span>
            <span className={styles.stackedHint}>{hint}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

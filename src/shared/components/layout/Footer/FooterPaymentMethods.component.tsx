import { CreditCard, Smartphone, Wallet, type LucideIcon } from "lucide-react";
import { FOOTER_PAYMENT_CHIP } from "../../../styles/layout/footer.styles";

interface FooterPaymentMethod {
  label: string;
  icon: LucideIcon;
}

/**
 * Accepted payment brands as labelled chips. Brand marks themselves are
 * trademarked artwork, so each chip pairs a generic finance icon with the
 * brand name rather than bundling third-party logo assets.
 */
const PAYMENT_METHODS: readonly FooterPaymentMethod[] = [
  { label: "Visa", icon: CreditCard },
  { label: "Mastercard", icon: Wallet },
  { label: "UPI", icon: Smartphone },
];

interface FooterPaymentMethodsProps {
  className?: string;
}

export function FooterPaymentMethods({ className }: FooterPaymentMethodsProps) {
  return (
    <ul className={className}>
      {PAYMENT_METHODS.map(({ label, icon: Icon }) => (
        <li key={label} className={FOOTER_PAYMENT_CHIP}>
          <Icon size={14} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}

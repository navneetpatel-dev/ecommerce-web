import Link from "next/link";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { authFormsStyles } from "../../styles/shell/authForms.styles";

interface RegisterTermsFieldProps {
  accepted: boolean;
  error?: string;
  onAcceptedChange: (accepted: boolean) => void;
}

/**
 * Terms consent row. The checkbox label wraps the policy links — per the HTML
 * spec a click on an interactive child does not toggle the control, so the
 * links navigate without flipping the checkbox.
 */
export function RegisterTermsField({
  accepted,
  error,
  onAcceptedChange,
}: RegisterTermsFieldProps) {
  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    onAcceptedChange(checked === true);
  };

  return (
    <>
      <div className={authFormsStyles.termsRow}>
        <Checkbox
          id="acceptTerms"
          checked={accepted}
          onCheckedChange={handleCheckedChange}
        />
        <label htmlFor="acceptTerms" className={authFormsStyles.termsLabel}>
          {LABELS.agreeToTermsLead}{" "}
          <Link href={PATHS.terms} className={authFormsStyles.termsLink}>
            {LABELS.termsOfService}
          </Link>{" "}
          {LABELS.agreeToTermsJoin}{" "}
          <Link href={PATHS.privacy} className={authFormsStyles.termsLink}>
            {LABELS.privacyPolicy}
          </Link>
        </label>
      </div>
      {error ? (
        <p role="alert" className={authFormsStyles.dangerBodySm}>
          {error}
        </p>
      ) : null}
    </>
  );
}

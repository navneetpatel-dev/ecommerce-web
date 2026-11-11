import Link from "next/link";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { authFormsStyles } from "../../styles/shell/authForms.styles";

interface ResetLinkProblemProps {
  message: string;
}

/** Why the reset link cannot be used, and the way to a new one. */
export function ResetLinkProblem({ message }: ResetLinkProblemProps) {
  return (
    <div role="alert" className={authFormsStyles.linkProblem}>
      <p className={authFormsStyles.linkProblemTitle}>
        {LABELS.resetLinkInvalidTitle}
      </p>
      <p>{message}</p>
      <Link
        href={PATHS.forgotPassword}
        className={authFormsStyles.footerLinkInline}
      >
        {LABELS.requestNewResetLink}
      </Link>
    </div>
  );
}

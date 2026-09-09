import { LABELS } from "@/shared/constants/labels";
import { authFormsStyles } from "./authForms.styles";

export function OAuthDivider() {
  return (
    <div className={authFormsStyles.dividerRoot}>
      <div className={authFormsStyles.dividerLineWrapper}>
        <span className={authFormsStyles.dividerLine} />
      </div>
      <div className={authFormsStyles.dividerTextWrapper}>
        <span className={authFormsStyles.dividerText}>
          {LABELS.orContinueWith}
        </span>
      </div>
    </div>
  );
}

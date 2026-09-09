"use client";

import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { LABELS } from "@/shared/constants/labels";
import { usePersonalInfoSection } from "./usePersonalInfoSection.hook";
import { PersonalInfoForm } from "./PersonalInfoForm.component";
import { ProfileAside } from "./ProfileAside.component";
import { PersonalInfoSectionLoadingSkeleton } from "./PersonalInfoSectionLoadingSkeleton.component";
import { personalInfoSectionStyles as styles } from "./personalInfoSection.styles";

/** Personal-info section: renders the form hook's prepared state with pure JSX layout. */
export function PersonalInfoSection() {
  const {
    profile,
    isLoading,
    isError,
    error,
    form,
    errors,
    isWorkspace,
    canSubmit,
    disableHint,
    showSaved,
    pending,
    submitError,
    onSubmit,
  } = usePersonalInfoSection();

  if (isLoading) {
    return <PersonalInfoSectionLoadingSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className={styles.errorContainer}>
        <QueryErrorAlert error={error} fallback={LABELS.couldNotLoadProfile} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <PersonalInfoForm
          register={form.register}
          errors={errors}
          isWorkspace={isWorkspace}
          canSubmit={canSubmit}
          disableHint={disableHint}
          showSaved={showSaved}
          pending={pending}
          submitError={submitError}
          onSubmit={onSubmit}
        />

        <ProfileAside profile={profile} isWorkspace={isWorkspace} />
      </div>
    </div>
  );
}

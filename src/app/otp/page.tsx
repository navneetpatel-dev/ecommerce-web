import { OtpPage } from "@/features/auth";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.verifyOtpTitle);

export default function Otp() {
  return <OtpPage />;
}

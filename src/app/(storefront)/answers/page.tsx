import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { MyAnswersPage } from "@/features/productQna";
import { AuthGate } from "@/shared/components/system/AuthGate.component";

export const metadata = generateNoIndexMetadata("My answers");

export default function MyAnswersRoute() {
  return (
    <AuthGate>
      <MyAnswersPage />
    </AuthGate>
  );
}

import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { MyReturnsPage } from "@/features/returns";
import { AuthGate } from "@/shared/components/AuthGate.component";

export const metadata = generateNoIndexMetadata("Returns");

export default function MyReturnsRoute() {
  return (
    <AuthGate>
      <MyReturnsPage />
    </AuthGate>
  );
}

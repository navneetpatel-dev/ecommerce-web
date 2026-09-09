import { generateHomeMetadata } from "@/shared/seo/metadata";
import { JsonLd } from "@/shared/seo";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/shared/seo/structured-data";
import { HomePage } from "@/features/home";

export const metadata = generateHomeMetadata();

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
      <HomePage />
    </>
  );
}

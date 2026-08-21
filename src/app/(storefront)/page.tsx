import { generateHomeMetadata } from "@/shared/seo/metadata";
import { JsonLd } from "@/shared/seo";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/shared/seo/structured-data";
import { HomePage } from "@/features/home";

export const metadata = generateHomeMetadata();

export default function Home() {
  return (
    <>
      <JsonLd data={generateOrganizationSchema()} />
      <JsonLd data={generateWebSiteSchema()} />
      <HomePage />
    </>
  );
}

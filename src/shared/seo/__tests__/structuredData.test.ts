import { describe, expect, it } from "vitest";
import {
  generateArticleSchema,
  generateOrganizationSchema,
  generateStoreSchema,
} from "../structured-data";
import { SITE } from "../constants";

describe("generateArticleSchema", () => {
  it("describes the help article that is rendered on the page", () => {
    const schema = generateArticleSchema({
      title: "How returns work",
      summary: "Return windows and pickup steps.",
      url: `${SITE.url}/help/how-returns-work`,
    });

    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("How returns work");
    expect(schema.description).toBe("Return windows and pickup steps.");
    expect(schema.mainEntityOfPage).toBe(`${SITE.url}/help/how-returns-work`);
    expect(schema.publisher).toMatchObject({
      "@type": "Organization",
      name: SITE.name,
    });
  });
});

describe("generateStoreSchema", () => {
  it("names the vendor and its parent marketplace", () => {
    const schema = generateStoreSchema({
      name: "Loom & Co",
      url: `${SITE.url}/vendors/loom-co`,
      description: "Handloom sarees from Kanchipuram.",
      imageUrl: "https://cdn.example.com/loom.png",
    });

    expect(schema["@type"]).toBe("Store");
    expect(schema.name).toBe("Loom & Co");
    expect(schema.image).toBe("https://cdn.example.com/loom.png");
    expect(schema.parentOrganization).toMatchObject({ name: SITE.name });
  });

  it("omits optional fields the API did not send", () => {
    const schema = generateStoreSchema({
      name: "Bare Vendor",
      url: `${SITE.url}/vendors/bare`,
      description: null,
      imageUrl: null,
    });

    expect(schema).not.toHaveProperty("description");
    expect(schema).not.toHaveProperty("image");
  });
});

describe("generateOrganizationSchema", () => {
  it("still publishes the marketplace identity with its social profile", () => {
    const schema = generateOrganizationSchema();

    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe(SITE.name);
    expect(schema.logo).toBe(`${SITE.url}/icon-512.png`);
    expect(schema.sameAs).toHaveLength(1);
  });
});

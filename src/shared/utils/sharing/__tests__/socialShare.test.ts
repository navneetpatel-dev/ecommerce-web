import { describe, expect, it } from "vitest";
import { getSocialShareUrl } from "../socialShare";

describe("socialShare getSocialShareUrl", () => {
  const sampleData = {
    url: "http://localhost:5273/s/AbC123x",
    title: "Awesome T-Shirt",
    imageUrl: "https://example.com/tshirt.jpg",
    description: "Great cotton t-shirt",
  };

  it("builds WhatsApp share url with prefilled text and link", () => {
    const url = getSocialShareUrl("whatsapp", sampleData);
    expect(url).toContain("https://api.whatsapp.com/send?text=");
    expect(url).toContain(encodeURIComponent("Awesome T-Shirt"));
    expect(url).toContain(encodeURIComponent(sampleData.url));
  });

  it("builds Facebook share url with encoded url", () => {
    const url = getSocialShareUrl("facebook", sampleData);
    expect(url).toBe(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sampleData.url)}`,
    );
  });

  it("builds X / Twitter share url with title and url", () => {
    const url = getSocialShareUrl("twitter", sampleData);
    expect(url).toContain("https://twitter.com/intent/tweet?");
    expect(url).toContain(`url=${encodeURIComponent(sampleData.url)}`);
    expect(url).toContain(
      `text=${encodeURIComponent("Check out Awesome T-Shirt")}`,
    );
  });

  it("builds Telegram share url", () => {
    const url = getSocialShareUrl("telegram", sampleData);
    expect(url).toBe(
      `https://t.me/share/url?url=${encodeURIComponent(sampleData.url)}&text=${encodeURIComponent(sampleData.title)}`,
    );
  });

  it("builds Pinterest share url with image media", () => {
    const url = getSocialShareUrl("pinterest", sampleData);
    expect(url).toContain("https://pinterest.com/pin/create/button/?");
    expect(url).toContain(`media=${encodeURIComponent(sampleData.imageUrl)}`);
  });

  it("builds LinkedIn share url", () => {
    const url = getSocialShareUrl("linkedin", sampleData);
    expect(url).toBe(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sampleData.url)}`,
    );
  });

  it("builds Email mailto url", () => {
    const url = getSocialShareUrl("email", sampleData);
    expect(url).toContain("mailto:?subject=");
    expect(url).toContain(encodeURIComponent(sampleData.title));
  });
});

import type { MetadataRoute } from "next";
import { SITE } from "@/shared/seo/constants";
import { PATHS } from "@/shared/constants/paths/paths";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: PATHS.home,
        disallow: [
          PATHS.login,
          PATHS.register,
          PATHS.forgotPassword,
          PATHS.resetPassword,
          PATHS.otp,
          PATHS.verifyEmail,
          PATHS.cart,
          PATHS.checkout,
          PATHS.profile,
          PATHS.orders,
          PATHS.wishlist,
          PATHS.wallet,
          PATHS.myReturns,
          "/admin/",
          "/vendor/",
          "/delivery/",
          "/auth/",
          "/support/",
          "/gift-cards/redeem/",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}

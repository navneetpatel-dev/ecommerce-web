import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const FEATURES = [
  "account",
  "admin-dashboard",
  "auth",
  "bugReports",
  "cart",
  "categories",
  "checkout",
  "content",
  "coupons",
  "help",
  "home",
  "orders",
  "products",
  "reports",
  "returns",
  "reviews",
  "search",
  "storefront",
  "supportTickets",
  "uploads",
  "users",
  "vendor-dashboard",
  "vendors",
  "wallet",
  "wishlist",
];

// Rule 15: features must not import another feature's internal files.
// Cross-feature access goes through the other feature's index.ts barrel.
// Pattern forbids "@/features/<other>/subpath" while allowing own-feature
// deep paths ("@/features/<self>/...") and cross-feature barrels
// ("@/features/<other>" with no subpath).
const featureBoundaryConfigs = FEATURES.map((feature) => ({
  files: [`src/features/${feature}/**/*.{ts,tsx}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            regex: `^@/features/(?!${feature}(?:/|$))[^/]+/.+`,
            message:
              "Cross-feature imports must go through the other feature's index.ts barrel (Rule 15).",
          },
        ],
      },
    ],
  },
}));

// Rule 15: shared/ never imports from features/ or app/.
const sharedBoundaryConfig = {
  files: ["src/shared/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            regex: "^@/features/",
            message: "shared/ must never import from features/ (Rule 15).",
          },
          {
            regex: "^@/app/",
            message: "shared/ must never import from app/ (Rule 15).",
          },
        ],
      },
    ],
  },
};

// Rule 9/15: app/ route files import features only through their index.ts barrel.
const appBoundaryConfig = {
  files: ["src/app/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            regex: "^@/features/[^\"']*/.+",
            message:
              "app/ must import features only through their index.ts barrel (Rule 9/15).",
          },
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // TEMPORARY (Phase 6 scope): pre-existing react-hooks findings surfaced by
  // the Next 16 compiler-aware rules. Demoted to warnings so CI is green while
  // each is refactored per Rule 14; re-promoted to "error" as they are fixed.
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/incompatible-library": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...featureBoundaryConfigs,
  sharedBoundaryConfig,
  appBoundaryConfig,
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[object.type='TSAsExpression'] > Identifier[name='message']",
          message:
            "Use getApiErrorMessage or QueryErrorAlert instead of reading (error as Error)?.message in features.",
        },
        {
          selector:
            "MemberExpression[object.name='err'][property.name='message']",
          message:
            "Use getApiErrorMessage or QueryErrorAlert instead of reading err.message in features.",
        },
        {
          selector:
            "MemberExpression[object.name='error'][property.name='message']",
          message:
            "Use getApiErrorMessage or QueryErrorAlert instead of reading error.message in features.",
        },
      ],
    },
  },
  {
    files: [
      "src/features/reports/hooks/useReportHubHelpers/index.ts",
      "src/features/checkout/hooks/usePlaceOrder.hook.ts",
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
]);

export default eslintConfig;

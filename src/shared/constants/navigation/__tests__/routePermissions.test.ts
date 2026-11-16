import { describe, it, expect } from "vitest";
import { adminPermissionsForPath } from "../adminPermissionsForPath";
import { vendorPermissionsForPath } from "../vendorNav";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";

describe("Route Permissions Mapping", () => {
  describe("Admin Routes", () => {
    it("maps order and refund routes to fulfillment permissions", () => {
      expect(adminPermissionsForPath("/admin/orders")).toEqual(
        PERMISSIONS.ORDER_MANAGE,
      );
      expect(adminPermissionsForPath("/admin/returns")).toEqual(
        PERMISSIONS.ORDER_REFUND,
      );
      expect(adminPermissionsForPath("/admin/shipping")).toEqual(
        PERMISSIONS.SHIPPING_MANAGE,
      );
      expect(adminPermissionsForPath("/admin/support-tickets")).toEqual(
        PERMISSIONS.TICKET_MANAGE,
      );
      expect(adminPermissionsForPath("/admin/bug-reports")).toEqual(
        PERMISSIONS.BUG_REPORT_MANAGE,
      );
    });

    it("maps catalog and inventory routes to catalog permissions", () => {
      expect(adminPermissionsForPath("/admin/products")).toEqual([
        PERMISSIONS.PRODUCT_MANAGE,
        PERMISSIONS.PRODUCT_APPROVE,
      ]);
      expect(adminPermissionsForPath("/admin/inventory")).toEqual([
        PERMISSIONS.PRODUCT_MANAGE,
        PERMISSIONS.PRODUCT_UPDATE,
      ]);
      expect(adminPermissionsForPath("/admin/categories")).toEqual(
        PERMISSIONS.CATEGORY_MANAGE,
      );
      expect(adminPermissionsForPath("/admin/tax")).toEqual(
        PERMISSIONS.TAX_MANAGE,
      );
    });

    it("maps finance, vendor and security management routes", () => {
      expect(adminPermissionsForPath("/admin/vendors")).toEqual([
        PERMISSIONS.VENDOR_MANAGE,
        PERMISSIONS.VENDOR_APPROVE,
      ]);
      expect(adminPermissionsForPath("/admin/finance")).toEqual([
        PERMISSIONS.PAYOUT_MANAGE,
        PERMISSIONS.COMMISSION_VIEW,
      ]);
      expect(adminPermissionsForPath("/admin/users")).toEqual(
        PERMISSIONS.USER_MANAGE,
      );
      expect(adminPermissionsForPath("/admin/roles")).toEqual(
        PERMISSIONS.ROLE_MANAGE,
      );
      expect(adminPermissionsForPath("/admin/gift-cards")).toEqual(
        PERMISSIONS.GIFT_CARD_MANAGE,
      );
      expect(adminPermissionsForPath("/admin/audit")).toEqual(
        PERMISSIONS.AUDIT_VIEW,
      );
    });

    it("maps nested paths with prefixes correctly", () => {
      expect(adminPermissionsForPath("/admin/orders/12345")).toEqual(
        PERMISSIONS.ORDER_MANAGE,
      );
      expect(adminPermissionsForPath("/admin/vendors/vendor-1/edit")).toEqual([
        PERMISSIONS.VENDOR_MANAGE,
        PERMISSIONS.VENDOR_APPROVE,
      ]);
      expect(adminPermissionsForPath("/admin/unknown-page")).toEqual(
        PERMISSIONS.ANALYTICS_VIEW,
      );
    });
  });

  describe("Vendor Routes", () => {
    it("maps financial and team routes requiring PAYOUT_VIEW", () => {
      expect(vendorPermissionsForPath("/vendor/dashboard/payouts")).toEqual(
        PERMISSIONS.PAYOUT_VIEW,
      );
      expect(vendorPermissionsForPath("/vendor/dashboard/analytics")).toEqual(
        PERMISSIONS.PAYOUT_VIEW,
      );
      expect(vendorPermissionsForPath("/vendor/dashboard/team")).toEqual(
        PERMISSIONS.PAYOUT_VIEW,
      );
    });

    it("maps order and return fulfillment routes to SUBORDER_MANAGE", () => {
      expect(vendorPermissionsForPath("/vendor/dashboard/orders")).toEqual(
        PERMISSIONS.SUBORDER_MANAGE,
      );
      expect(vendorPermissionsForPath("/vendor/dashboard/returns")).toEqual(
        PERMISSIONS.SUBORDER_MANAGE,
      );
    });

    it("maps product catalog and UGC routes", () => {
      expect(vendorPermissionsForPath("/vendor/dashboard/products")).toEqual([
        PERMISSIONS.PRODUCT_CREATE,
        PERMISSIONS.PRODUCT_UPDATE,
        PERMISSIONS.PRODUCT_DELETE,
      ]);
      expect(vendorPermissionsForPath("/vendor/dashboard/reviews")).toEqual(
        PERMISSIONS.REVIEW_RESPOND,
      );
      expect(vendorPermissionsForPath("/vendor/dashboard/qna")).toEqual(
        PERMISSIONS.REVIEW_RESPOND,
      );
    });

    it("falls back safely for unknown vendor paths", () => {
      expect(
        vendorPermissionsForPath("/vendor/dashboard/unknown-page"),
      ).toEqual([PERMISSIONS.PRODUCT_UPDATE, PERMISSIONS.SUBORDER_MANAGE]);
    });
  });
});

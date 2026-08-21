// Storefront feature — public API
//
// Owns the customer-facing storefront chrome: the storefront route layout and
// the header cluster (Header, MobileNavDrawer, useHeader, HeaderContainer).
// The workspace (admin/vendor) layouts also render HeaderContainer in
// "workspace menu" mode, so it is part of this feature's public surface.
import { StorefrontLayout } from "./components/StorefrontLayout";
import { HeaderContainer } from "./containers/HeaderContainer";

export { StorefrontLayout, HeaderContainer };

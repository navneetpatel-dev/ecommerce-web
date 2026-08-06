/** Shared UI labels — single source for nav, footer, and repeated CTAs. */
export const LABELS = {
  // CTAs / commerce
  continueShopping: 'Continue shopping',
  outOfStock: 'Out of stock',
  addToWishlist: 'Add to wishlist',
  removeFromWishlist: 'Remove from wishlist',
  addToCart: 'Add to cart',
  approvalQueue: 'Approval queue',
  newArrivals: 'New Arrivals',
  topRated: 'Top Rated',
  allProducts: 'All Products',
  shop: 'Shop',
  goToMyOrders: 'Go to my orders',
  allOrders: 'All orders',

  // Auth
  logIn: 'Log in',
  backToLogin: 'Back to login',
  alreadyHaveAccount: 'Already have an account?',
  chooseAccount: 'Choose an account',
  chooseAccountHint: 'This email has more than one account. Select which one to sign in as.',
  welcomeBack: 'Welcome back',
  logInToAccount: 'Log in to your account',
  dontHaveAccount: "Don't have an account?",
  register: 'Register',
  loginFailed: 'Login failed',

  // Footer sections
  company: 'Company',
  customerService: 'Customer Service',
  sellOnMarketplace: 'Sell on Marketplace',
  connect: 'Connect',

  // Footer / nav link labels
  about: 'About',
  contact: 'Contact',
  blog: 'Blog',
  faq: 'FAQ',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  trackOrder: 'Track Order',
  helpCenter: 'Help Center',
  becomeSeller: 'Become a Seller',
  vendorDashboard: 'Vendor Dashboard',

  // Admin nav
  vendors: 'Vendors',
  products: 'Products',
  categories: 'Categories',
  orders: 'Orders',
  returnsRefunds: 'Returns / Refunds',
  coupons: 'Coupons',
  reviews: 'Reviews',
  tax: 'Tax',
  shipping: 'Shipping',
  financePayouts: 'Finance / Payouts',
  users: 'Users',
  analytics: 'Analytics',
  audit: 'Audit',
  settings: 'Settings',

  // Vendor / account nav
  overview: 'Overview',
  payouts: 'Payouts',
  personalInfo: 'Personal info',
  security: 'Security',
  addresses: 'Addresses',
  privacy: 'Privacy',

  // Return reasons
  returnReasonDamaged: 'Damaged',
  returnReasonWrongItem: 'Wrong item',
  returnReasonNotAsDescribed: 'Not as described',
  returnReasonNoLongerNeeded: 'No longer needed',
  returnReasonOther: 'Other',

  // Unavailable item badges
  unavailableReasonOutOfStock: 'Out of stock',
  unavailableReasonProductUnpublished: 'No longer available',
  unavailableReasonVendorUnavailable: 'Shop unavailable',
  unavailableGeneric: 'Unavailable',

  // Cart / checkout unavailability
  removeUnavailableToCheckout: 'Remove unavailable items to continue',

  // Vendor storefront unavailable
  shopUnavailableHeading: 'This shop is unavailable',
  shopUnavailableBody: 'The shop you are looking for is no longer active or has been removed.',
  browseOtherShops: 'Browse other shops',

  // Coupon messages
  couponRemovedUnavailable: 'Coupon was removed because some items are no longer available.',
  couponRemovedCartChange: 'Your coupon was removed due to cart changes.',
} as const

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_ORDER_MANAGER: 'ADMIN_ORDER_MANAGER',
  ADMIN_CATALOG_MANAGER: 'ADMIN_CATALOG_MANAGER',
  VENDOR_OWNER: 'VENDOR_OWNER',
  VENDOR_STAFF: 'VENDOR_STAFF',
  CUSTOMER: 'CUSTOMER',
} as const

export type RoleName = (typeof ROLES)[keyof typeof ROLES]
export const ROLE_VALUES = Object.values(ROLES) as [RoleName, ...RoleName[]]

export const ROLE_LABELS: Record<RoleName, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN_ORDER_MANAGER]: 'Order Manager',
  [ROLES.ADMIN_CATALOG_MANAGER]: 'Catalog Manager',
  [ROLES.VENDOR_OWNER]: 'Vendor Owner',
  [ROLES.VENDOR_STAFF]: 'Vendor Staff',
  [ROLES.CUSTOMER]: 'Customer',
}

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN_ORDER_MANAGER,
  ROLES.ADMIN_CATALOG_MANAGER,
] as const

export const VENDOR_ROLES = [ROLES.VENDOR_OWNER, ROLES.VENDOR_STAFF] as const

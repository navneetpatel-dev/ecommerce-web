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

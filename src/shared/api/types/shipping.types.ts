/** Per-vendor answer from `GET /api/shipping/serviceability` — see `checkServiceability`. */
export interface ServiceabilityVendor {
  vendorId: string;
  serviceable: boolean;
  methods: string[];
  estimatedDays: { min: number; max: number } | null;
  /** Lowest free-shipping threshold among the vendor's rates, else null. */
  freeShippingThreshold: number | null;
}

/**
 * Whether a pincode is delivered to at all. `serviceable` is the verdict for the whole
 * basket: every vendor asked about has to serve the pincode, so one `false` in `vendors`
 * is enough to stop the funnel — the vendors list says which one.
 */
export interface PincodeServiceability {
  pincode: string;
  serviceable: boolean;
  vendors: ServiceabilityVendor[];
  methods: string[];
  estimatedDays: { min: number; max: number } | null;
  /** Zone-wide threshold when the answer isn't scoped to vendors, else null. */
  freeShippingThreshold: number | null;
}

/**
 * Centralized timing values (Rule 8): debounce windows, toast/animation
 * durations, polling intervals, and cache timings. Defined once so behavior
 * stays consistent across features and platforms.
 *
 * Feature-specific debounce windows stay in their feature constants
 * (`features/search/constants.ts`, `features/products/constants/filterTiming.ts`)
 * when only that feature consumes them.
 */

/** Delay before the cookie banner slides in after mount. */
export const COOKIE_BANNER_SHOW_DELAY_MS = 500;

/** How long the "copied" confirmation stays visible in share actions. */
export const SHARE_COPIED_RESET_MS = 1500;

/** Cross-fade duration between gallery images. */
export const GALLERY_TRANSITION_MS = 200;

/** Hover delay before a desktop mega-menu opens; matching close delay. */
export const MEGA_MENU_OPEN_DELAY_MS = 150;
export const MEGA_MENU_CLOSE_DELAY_MS = 200;

/** OTP resend countdown + the brief "code sent" pulse duration. */
export const OTP_RESEND_DELAY_MS = 400;
export const OTP_SENT_PULSE_MS = 1600;

/** Grace period before report downloads are considered stalled (UX hint). */
export const REPORT_DOWNLOAD_TOAST_MS = 1500;

/** Direct file download timeout for report exports. */
export const EXPORT_DOWNLOAD_TIMEOUT_MS = 120_000;

/** Dropdown close delay for search suggestion dismissal. */
export const SEARCH_DROPDOWN_CLOSE_MS = 200;

/** API request timeout applied by the shared client (Optimization §9). */
export const API_TIMEOUT_MS = 15_000;

/** Token refresh may wait longer when the API is under load. */
export const REFRESH_TIMEOUT_MS = 30_000;

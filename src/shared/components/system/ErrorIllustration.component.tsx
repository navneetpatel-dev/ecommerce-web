import { cn } from "@/shared/utils/dom/cn";
import { errorIllustrationStyles as s } from "../../styles/system/errorIllustration.styles";

export type ErrorIllustrationVariant = "error" | "notFound";

interface ErrorIllustrationProps {
  variant?: ErrorIllustrationVariant;
  className?: string;
}

/** Shared halo: brand disc, dotted orbit, sparkles and a floor shadow that breathes with the float. */
function IllustrationBackdrop() {
  return (
    <>
      <circle cx="120" cy="94" r="80" className={s.disc} />
      <circle
        cx="120"
        cy="94"
        r="92"
        strokeWidth="1.5"
        strokeDasharray="2 7"
        className={s.orbit}
      />
      <ellipse cx="120" cy="180" rx="56" ry="6" className={s.floorShadow} />
      <path
        d="M38 105Q38 112 45 112Q38 112 38 119Q38 112 31 112Q38 112 38 105Z"
        className={s.sparkle}
      />
      <path
        d="M206 34Q206 40 212 40Q206 40 206 46Q206 40 200 40Q206 40 206 34Z"
        className={s.sparkle}
      />
      <circle cx="210" cy="122" r="3" className={s.dot} />
      <circle cx="54" cy="152" r="2.5" className={s.dotMuted} />
    </>
  );
}

/** "Couldn't load": an uneasy shopping bag, an alert badge and a pulled-out plug. */
function UnpluggedBagFigure() {
  return (
    <>
      <path
        d="M104 76V68a16 16 0 0 1 32 0v8"
        strokeWidth="2.5"
        className={s.line}
      />
      <path
        d="M86 76H154L160 152Q160.6 160 152.6 160H87.4Q79.4 160 80 152Z"
        strokeWidth="2.5"
        className={s.surface}
      />
      <path d="M85 77.5H155L155.9 90H84.1Z" className={s.band} />
      <circle cx="104" cy="83" r="2.5" className={s.inkFill} />
      <circle cx="136" cy="83" r="2.5" className={s.inkFill} />
      <circle cx="109" cy="116" r="3.2" className={s.inkFill} />
      <circle cx="131" cy="116" r="3.2" className={s.inkFill} />
      <path d="M111 134q4.5-4 9 0t9 0" strokeWidth="2.5" className={s.line} />
      <path
        d="M146 160C146 174 160 178 173 171"
        strokeWidth="2.5"
        className={s.line}
      />
      <rect
        x="172"
        y="164"
        width="11"
        height="12"
        rx="2.5"
        className={s.inkFill}
      />
      <path d="M183 167h5M183 173h5" strokeWidth="2" className={s.line} />
      <path
        d="M194 159l3-5M196 170h6M194 181l3 5"
        strokeWidth="2"
        className={s.brandLine}
      />
      <rect
        x="207"
        y="161"
        width="9"
        height="18"
        rx="2.5"
        strokeWidth="2"
        className={s.socket}
      />
      <circle cx="154" cy="70" r="15" strokeWidth="4" className={s.badge} />
      <path d="M154 62.5v8.5" strokeWidth="3" className={s.badgeMark} />
      <circle cx="154" cy="77" r="1.9" className={s.badgeDot} />
    </>
  );
}

/** "Not found": an open, empty parcel being searched with a magnifier. */
function EmptyParcelFigure() {
  return (
    <>
      <path
        d="M80 100L94 84H146L160 100Z"
        strokeWidth="2.5"
        className={s.inner}
      />
      <path
        d="M80 100L94 84L70 72L56 90Z"
        strokeWidth="2.5"
        className={s.surface}
      />
      <path
        d="M160 100L146 84L170 72L184 90Z"
        strokeWidth="2.5"
        className={s.surface}
      />
      <path
        d="M80 100H160V152Q160 158 154 158H86Q80 158 80 152Z"
        strokeWidth="2.5"
        className={s.surface}
      />
      <path d="M81.3 101.3H158.7V112H81.3Z" className={s.band} />
      <circle cx="108" cy="126" r="3.2" className={s.inkFill} />
      <circle cx="132" cy="126" r="3.2" className={s.inkFill} />
      <circle cx="120" cy="141" r="4" strokeWidth="2.5" className={s.line} />
      <path
        d="M44 34a7 7 0 1 1 9 6.7c-1.6.6-2 1.6-2 3.3"
        strokeWidth="2.5"
        className={s.brandLine}
      />
      <circle cx="51" cy="50.5" r="1.8" className={s.brandFill} />
      <path d="M179 83l12 12" strokeWidth="6" className={s.line} />
      <circle cx="167" cy="71" r="17" strokeWidth="2.5" className={s.surface} />
      <path
        d="M158 65a10 10 0 0 1 8-5"
        strokeWidth="2"
        className={s.brandLine}
      />
    </>
  );
}

/**
 * Generic, theme-aware artwork for error and not-found states. Decorative only
 * (`aria-hidden`): the heading and message carry the meaning.
 */
export function ErrorIllustration({
  variant = "error",
  className,
}: ErrorIllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={cn(s.root, className)}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <IllustrationBackdrop />
      <g className={s.figure}>
        {variant === "notFound" ? (
          <EmptyParcelFigure />
        ) : (
          <UnpluggedBagFigure />
        )}
      </g>
    </svg>
  );
}

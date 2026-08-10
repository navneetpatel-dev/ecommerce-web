'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaImage } from '@/shared/components/MediaImage'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/cn'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'

export interface HeroSlide {
  id: string
  eyebrow: string
  headline: string
  subheadline: string
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  imageSrc: string
  imageMobileSrc?: string
  imageAlt: string
}

const AUTOPLAY_MS = 4500
const EASE = [0.22, 1, 0.36, 1] as const

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'makers',
    eyebrow: 'Marketplace',
    headline: 'Discover independent sellers',
    subheadline:
      "Handcrafted goods, artisan food, and unique finds from India's best small businesses.",
    ctaLabel: 'Shop Now',
    ctaHref: PATHS.products,
    secondaryCtaLabel: 'New arrivals',
    secondaryCtaHref: PATHS.productsNewest,
    imageSrc:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=2400&q=80',
    imageMobileSrc:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Artisan hands shaping clay on a pottery wheel',
  },
  {
    id: 'textiles',
    eyebrow: 'Crafted textiles',
    headline: 'Woven with intention',
    subheadline:
      'From handloom cotton to block-printed linen — pieces made slowly, meant to last.',
    ctaLabel: 'Shop Now',
    ctaHref: `${PATHS.products}?search=textile`,
    secondaryCtaLabel: 'New arrivals',
    secondaryCtaHref: PATHS.productsNewest,
    imageSrc:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=80',
    imageMobileSrc:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Folded handwoven textiles in warm natural tones',
  },
  {
    id: 'kitchen',
    eyebrow: 'Pantry & table',
    headline: 'Taste the small-batch story',
    subheadline:
      'Spice blends, preserves, and tableware from kitchens and studios across the country.',
    ctaLabel: 'Shop Now',
    ctaHref: `${PATHS.products}?search=food`,
    secondaryCtaLabel: 'New arrivals',
    secondaryCtaHref: PATHS.productsNewest,
    imageSrc:
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=2400&q=80',
    imageMobileSrc:
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Artisan spices and ingredients arranged on a wooden table',
  },
]

function resolveDirection(from: number, to: number, count: number) {
  if (from === count - 1 && to === 0) return 1
  if (from === 0 && to === count - 1) return -1
  return to > from ? 1 : -1
}

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '72%' : '-72%',
    opacity: 0.35,
    scale: 1.12,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-28%' : '28%',
    opacity: 0,
    scale: 1.04,
  }),
}

const copyContainer = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 56 : -56,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: EASE,
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -36 : 36,
    transition: { duration: 0.35, ease: EASE },
  }),
}

const copyItem = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 28 : -28,
    y: 10,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
}

interface HeroSectionProps {
  slides?: HeroSlide[]
  autoplayMs?: number
}

export function HeroSection({
  slides = DEFAULT_SLIDES,
  autoplayMs = AUTOPLAY_MS,
}: HeroSectionProps) {
  const labelId = useId()
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const touchStartX = useRef<number | null>(null)
  const indexRef = useRef(0)

  const count = slides.length
  const active = slides[index] ?? slides[0]
  const paused = Boolean(reduceMotion) || count <= 1

  const goTo = useCallback(
    (next: number, forcedDirection?: 1 | -1) => {
      if (count === 0) return
      const from = indexRef.current
      const normalized = ((next % count) + count) % count
      if (normalized === from) return
      setDirection(forcedDirection ?? resolveDirection(from, normalized, count))
      indexRef.current = normalized
      setIndex(normalized)
    },
    [count]
  )

  const goNext = useCallback(() => goTo(indexRef.current + 1, 1), [goTo])
  const goPrev = useCallback(() => goTo(indexRef.current - 1, -1), [goTo])

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(goNext, autoplayMs)
    return () => window.clearInterval(timer)
  }, [paused, autoplayMs, goNext])

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    }
  }

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 48) return
    if (delta < 0) goNext()
    else goPrev()
  }

  if (!active) return null

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
    >
      <h2 id={labelId} className="sr-only">
        Featured collections
      </h2>

      <div className="relative min-h-[min(78vh,640px)] md:min-h-[min(82vh,720px)]">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={active.id}
            custom={direction}
            variants={reduceMotion ? undefined : imageVariants}
            initial={reduceMotion ? { opacity: 0 } : 'enter'}
            animate={reduceMotion ? { opacity: 1 } : 'center'}
            exit={reduceMotion ? { opacity: 0 } : 'exit'}
            transition={{ duration: reduceMotion ? 0.25 : 0.9, ease: EASE }}
            className="absolute inset-0 will-change-transform"
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                initial={reduceMotion ? false : { scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : autoplayMs / 1000, ease: 'linear' }}
              >
                <div className="absolute inset-0 hidden md:block">
                  <MediaImage
                    src={active.imageSrc}
                    alt={active.imageAlt}
                    unavailableLabel={`${active.headline} image not available`}
                    priority={index === 0}
                    imageClassName="object-cover"
                    sizes="100vw"
                    className="absolute inset-0"
                  />
                </div>
                <div className="absolute inset-0 block md:hidden">
                  <MediaImage
                    src={active.imageMobileSrc || active.imageSrc}
                    alt={active.imageAlt}
                    unavailableLabel={`${active.headline} image not available`}
                    priority={index === 0}
                    imageClassName="object-cover"
                    sizes="100vw"
                    className="absolute inset-0"
                  />
                </div>
              </motion.div>
            </div>

            <div
              className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20"
              aria-hidden
            />
          </motion.div>
        </AnimatePresence>

        <div className="storefront-container relative z-10 flex h-full min-h-[min(78vh,640px)] flex-col justify-end pb-24 pt-16 md:min-h-[min(82vh,720px)] md:justify-center md:pb-24 md:pt-20">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={active.id + '-copy'}
              custom={direction}
              variants={reduceMotion ? undefined : copyContainer}
              initial={reduceMotion ? { opacity: 0 } : 'enter'}
              animate={reduceMotion ? { opacity: 1 } : 'center'}
              exit={reduceMotion ? { opacity: 0 } : 'exit'}
              className="max-w-xl"
              aria-live="polite"
              aria-atomic="true"
            >
              <motion.p
                custom={direction}
                variants={reduceMotion ? undefined : copyItem}
                className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70"
              >
                {active.eyebrow}
              </motion.p>
              <motion.h1
                custom={direction}
                variants={reduceMotion ? undefined : copyItem}
                className="mt-3 font-display leading-[1.05] text-white"
                style={{ fontSize: 'var(--text-display-lg)' }}
              >
                {active.headline}
              </motion.h1>
              <motion.p
                custom={direction}
                variants={reduceMotion ? undefined : copyItem}
                className="mt-4 max-w-md text-[1.0625rem] text-white/80"
              >
                {active.subheadline}
              </motion.p>
              <motion.div
                custom={direction}
                variants={reduceMotion ? undefined : copyItem}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link
                  href={active.ctaHref}
                  className={cn(
                    'inline-flex h-12 items-center gap-2 rounded-full bg-white px-7',
                    'text-[0.9375rem] font-medium tracking-tight text-neutral-950',
                    'transition-[transform,background-color] duration-200',
                    'hover:bg-white/92 active:scale-[0.98]'
                  )}
                >
                  {active.ctaLabel}
                  <ArrowRight size={16} strokeWidth={2} aria-hidden />
                </Link>
                {active.secondaryCtaLabel && active.secondaryCtaHref ? (
                  <Link
                    href={active.secondaryCtaHref}
                    className={cn(
                      'inline-flex h-12 items-center rounded-full border border-white/35 px-7',
                      'text-[0.9375rem] font-medium tracking-tight text-white',
                      'bg-white/5 backdrop-blur-sm',
                      'transition-[transform,background-color,border-color] duration-200',
                      'hover:border-white/55 hover:bg-white/12 active:scale-[0.98]'
                    )}
                  >
                    {active.secondaryCtaLabel}
                  </Link>
                ) : null}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {count > 1 ? (
          <>
            {/* Desktop: stacked controls on the right */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden items-center pr-4 md:flex lg:pr-8">
              <div className="pointer-events-auto flex flex-col gap-2">
                <CarouselIconButton label={LABELS.previousSlide} onClick={goPrev}>
                  <ChevronLeft size={20} />
                </CarouselIconButton>
                <CarouselIconButton label={LABELS.nextSlide} onClick={goNext}>
                  <ChevronRight size={20} />
                </CarouselIconButton>
              </div>
            </div>

            {/* Mobile: bottom corners — clear of centered stack controls on desktop */}
            <div className="absolute bottom-5 left-3 z-20 md:hidden">
              <CarouselIconButton label={LABELS.previousSlide} onClick={goPrev}>
                <ChevronLeft size={18} />
              </CarouselIconButton>
            </div>
            <div className="absolute bottom-5 right-3 z-20 md:hidden">
              <CarouselIconButton label={LABELS.nextSlide} onClick={goNext}>
                <ChevronRight size={18} />
              </CarouselIconButton>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

function CarouselIconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className="rounded-full border-white/40 bg-black/55 text-white shadow-elevation-2 backdrop-blur-md hover:border-white/70 hover:bg-black/70 hover:text-white"
    >
      {children}
    </Button>
  )
}

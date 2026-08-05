'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

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

const AUTOPLAY_MS = 6500

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'makers',
    eyebrow: 'Marketplace',
    headline: 'Discover independent sellers',
    subheadline:
      "Handcrafted goods, artisan food, and unique finds from India's best small businesses.",
    ctaLabel: 'Shop Now',
    ctaHref: '/products',
    secondaryCtaLabel: 'New arrivals',
    secondaryCtaHref: '/products?sort=newest',
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
    ctaHref: '/products?search=textile',
    secondaryCtaLabel: 'New arrivals',
    secondaryCtaHref: '/products?sort=newest',
    imageSrc:
      'https://images.unsplash.com/photo-1558171813-4c0880cb1189?auto=format&fit=crop&w=2400&q=80',
    imageMobileSrc:
      'https://images.unsplash.com/photo-1558171813-4c0880cb1189?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Folded handwoven textiles in warm natural tones',
  },
  {
    id: 'kitchen',
    eyebrow: 'Pantry & table',
    headline: 'Taste the small-batch story',
    subheadline:
      'Spice blends, preserves, and tableware from kitchens and studios across the country.',
    ctaLabel: 'Shop Now',
    ctaHref: '/products?search=food',
    secondaryCtaLabel: 'New arrivals',
    secondaryCtaHref: '/products?sort=newest',
    imageSrc:
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=2400&q=80',
    imageMobileSrc:
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Artisan spices and ingredients arranged on a wooden table',
  },
]

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
  const [hoverPaused, setHoverPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const indexRef = useRef(0)

  const count = slides.length
  const active = slides[index] ?? slides[0]
  const paused = hoverPaused || Boolean(reduceMotion) || count <= 1

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return
      const normalized = ((next % count) + count) % count
      indexRef.current = normalized
      setIndex(normalized)
    },
    [count]
  )

  const goNext = useCallback(() => goTo(indexRef.current + 1), [goTo])
  const goPrev = useCallback(() => goTo(indexRef.current - 1), [goTo])

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
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHoverPaused(false)
        }
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
    >
      <h2 id={labelId} className="sr-only">
        Featured collections
      </h2>

      <div className="relative min-h-[min(78vh,640px)] md:min-h-[min(82vh,720px)]">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={active.id}
            className="absolute inset-0"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0">
              <div className="hidden md:block absolute inset-0">
                <Image
                  src={active.imageSrc}
                  alt={active.imageAlt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="block md:hidden absolute inset-0">
                <Image
                  src={active.imageMobileSrc || active.imageSrc}
                  alt={active.imageAlt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
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

        <div className="relative z-10 mx-auto flex h-full min-h-[min(78vh,640px)] md:min-h-[min(82vh,720px)] max-w-[1600px] flex-col justify-end px-4 pb-16 pt-16 md:justify-center md:pb-24 md:pt-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id + '-copy'}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70">
                {active.eyebrow}
              </p>
              <h1
                className="mt-3 font-display text-white leading-[1.05]"
                style={{ fontSize: 'var(--text-display-lg)' }}
              >
                {active.headline}
              </h1>
              <p className="mt-4 max-w-md text-[1.0625rem] text-white/80">
                {active.subheadline}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
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
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {count > 1 ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden items-center pr-4 md:flex lg:pr-8">
              <div className="pointer-events-auto flex flex-col gap-2">
                <CarouselIconButton label="Previous slide" onClick={goPrev}>
                  <ChevronLeft size={20} />
                </CarouselIconButton>
                <CarouselIconButton label="Next slide" onClick={goNext}>
                  <ChevronRight size={20} />
                </CarouselIconButton>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 flex justify-end px-4 pb-5 md:hidden">
              <div className="flex gap-2">
                <CarouselIconButton label="Previous slide" onClick={goPrev}>
                  <ChevronLeft size={18} />
                </CarouselIconButton>
                <CarouselIconButton label="Next slide" onClick={goNext}>
                  <ChevronRight size={18} />
                </CarouselIconButton>
              </div>
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
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md transition-colors hover:border-white/55 hover:bg-black/50"
    >
      {children}
    </button>
  )
}

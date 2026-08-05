'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/cn'

interface HeroSectionProps {
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaHref?: string
  imageSrc?: string
  imageMobileSrc?: string
  imageAlt?: string
}

export function HeroSection({
  headline = 'Discover independent sellers',
  subheadline = "Handcrafted goods, artisan food, and unique finds from India's best small businesses.",
  ctaLabel = 'Shop Now',
  ctaHref = '/products',
  imageSrc,
  imageMobileSrc,
  imageAlt = 'Hero image',
}: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative w-full overflow-hidden bg-ink -mt-14 pt-14 lg:-mt-[72px] lg:pt-[72px]"
    >
      {/* Image */}
      {imageSrc ? (
        <>
          <div className="hidden md:block absolute inset-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              style={{ aspectRatio: '16/9' }}
            />
          </div>
          <div className="block md:hidden absolute inset-0">
            <Image
              src={imageMobileSrc || imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              style={{ aspectRatio: '4/5' }}
            />
          </div>
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-16 md:py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="max-w-lg"
        >
          <h1
            className={cn(
              'font-display leading-tight',
              imageSrc ? 'text-white' : 'text-paper'
            )}
            style={{ fontSize: 'var(--text-display-lg)', lineHeight: 1.05 }}
          >
            {headline}
          </h1>
          <p
            className={cn(
              'mt-4 text-[1.0625rem] max-w-md',
              imageSrc ? 'text-white/80' : 'text-paper/80'
            )}
          >
            {subheadline}
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="bg-paper text-ink hover:bg-paper/90"
              asChild
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

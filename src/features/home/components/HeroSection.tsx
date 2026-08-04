'use client'

import { motion } from 'motion/react'

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl bg-linear-to-br from-brand-dark to-brand p-8 md:p-16 overflow-hidden"
    >
      <div className="relative z-10 max-w-lg">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
          Discover independent sellers
        </h1>
        <p className="mt-4 text-lg text-white/80">
          Handcrafted goods, artisan food, and unique finds from India's best small businesses.
        </p>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-linear-to-l from-brand-light/20 to-transparent hidden md:block" />
    </motion.section>
  )
}

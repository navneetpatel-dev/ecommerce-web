'use client'

import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { LABELS } from '@/shared/constants/labels'
import { HELP_CATEGORIES } from '../../data/help-content'
import { CategoryCard } from './CategoryCard'

export function BrowseTopicsSection() {
  return (
    <section className="mt-12">
      <TextEyebrow>{LABELS.helpBrowseTopicsEyebrow}</TextEyebrow>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {HELP_CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </ul>
    </section>
  )
}

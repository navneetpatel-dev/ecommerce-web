'use client'

import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

export type AdminSectionTabItem = {
  value: string
  label: string
  count?: number
  content: ReactNode
}

interface AdminSectionTabsProps {
  title: string
  description?: string
  defaultValue: string
  tabs: AdminSectionTabItem[]
  className?: string
}

/** Segmented tab shell for admin list + queue screens (one panel visible at a time). */
export function AdminSectionTabs({
  title,
  description,
  defaultValue,
  tabs,
  className,
}: AdminSectionTabsProps) {
  return (
    <div className={cn('min-w-0 space-y-6', className)}>
      <header className="space-y-1">
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-[0.9375rem] text-ink-muted">{description}</p>
        ) : null}
      </header>

      <Tabs defaultValue={defaultValue} className="min-w-0">
        <TabsList
          className={cn(
            'flex h-auto w-full flex-wrap justify-start gap-1 rounded-md border border-line-strong',
            'bg-paper p-1',
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'group gap-2 rounded-sm border-0 border-b-0 px-4 py-2.5 text-[0.8125rem]',
                'text-ink-muted hover:text-ink',
                'data-[state=active]:bg-brand data-[state=active]:text-paper',
                'data-[state=active]:hover:bg-brand-hover data-[state=active]:hover:text-paper',
                'data-[state=active]:shadow-none',
              )}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 ? (
                <span
                  aria-label={String(tab.count)}
                  className={cn(
                    'inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5',
                    'text-[0.6875rem] font-bold leading-none tabular-nums',
                    'bg-accent text-paper shadow-sm',
                    'group-data-[state=active]:bg-paper group-data-[state=active]:text-brand',
                    'group-data-[state=active]:shadow-none',
                  )}
                >
                  {tab.count > 99 ? LABELS.countOverflow : tab.count}
                </span>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6 min-w-0 focus-visible:outline-none">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

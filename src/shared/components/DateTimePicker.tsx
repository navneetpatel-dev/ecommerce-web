'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function parseIso(value?: string | null): Date | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function toIso(date: Date) {
  return date.toISOString()
}

function roundMinute(m: number) {
  const stepped = Math.round(m / 5) * 5
  return Math.min(55, Math.max(0, stepped))
}

function formatDisplay(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
    new Date(year, month, 1),
  )
}

interface DateTimePickerProps {
  value?: string
  onChange: (iso: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  id?: string
}

/** Classy datetime control: calendar + time selects (ISO string in/out). */
export function DateTimePicker({
  value,
  onChange,
  placeholder = LABELS.pickDateTime,
  disabled = false,
  error = false,
  className,
  id,
}: DateTimePickerProps) {
  const selected = parseIso(value)
  const [open, setOpen] = useState(false)
  const initial = selected ?? new Date()
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())
  const [draftDay, setDraftDay] = useState<Date>(startOfDay(initial))
  const [hour, setHour] = useState(String(initial.getHours()).padStart(2, '0'))
  const [minute, setMinute] = useState(String(roundMinute(initial.getMinutes())).padStart(2, '0'))

  const syncFromValue = () => {
    const base = parseIso(value) ?? new Date()
    setViewYear(base.getFullYear())
    setViewMonth(base.getMonth())
    setDraftDay(startOfDay(base))
    setHour(String(base.getHours()).padStart(2, '0'))
    setMinute(String(roundMinute(base.getMinutes())).padStart(2, '0'))
  }

  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells: Array<Date | null> = []
    for (let i = 0; i < startPad; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d))
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewYear, viewMonth])

  const apply = (day: Date, h: string, m: string) => {
    const next = new Date(day)
    next.setHours(Number(h), Number(m), 0, 0)
    onChange(toIso(next))
  }

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  const today = startOfDay(new Date())

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) syncFromValue()
        setOpen(next)
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            'flex h-11 w-full cursor-pointer items-center justify-between rounded-sm border bg-surface px-4 text-left text-[0.9375rem] outline-none',
            'hover:bg-paper/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-danger' : 'border-line',
            className,
          )}
        >
          <span className={cn('truncate', selected ? 'text-ink' : 'text-ink-faint')}>
            {selected ? formatDisplay(selected) : placeholder}
          </span>
          <CalendarDays size={16} className="shrink-0 text-ink-muted" aria-hidden />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[320px] space-y-4 p-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label={LABELS.previousMonth}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-paper hover:text-ink"
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <p className="text-[0.875rem] font-semibold tracking-tight text-ink">
            {monthLabel(viewYear, viewMonth)}
          </p>
          <button
            type="button"
            aria-label={LABELS.nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-paper hover:text-ink"
            onClick={() => shiftMonth(1)}
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="flex h-8 items-center justify-center text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint"
            >
              {d}
            </div>
          ))}
          {days.map((day, i) => {
            if (!day) return <div key={`pad-${i}`} className="h-8" />
            const isSelected = sameDay(day, draftDay)
            const isToday = sameDay(day, today)
            return (
              <button
                key={day.toISOString()}
                type="button"
                className={cn(
                  'flex h-8 items-center justify-center rounded-sm text-[0.8125rem] tabular-nums transition-colors',
                  isSelected
                    ? 'bg-brand font-semibold text-paper'
                    : 'text-ink hover:bg-brand-subtle',
                  !isSelected && isToday && 'ring-1 ring-brand/50',
                )}
                onClick={() => {
                  setDraftDay(day)
                  apply(day, hour, minute)
                }}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-line pt-3">
          <div className="space-y-1.5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint">
              {LABELS.hour}
            </p>
            <Select
              value={hour}
              onValueChange={(h) => {
                setHour(h)
                apply(draftDay, h, minute)
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint">
              {LABELS.minute}
            </p>
            <Select
              value={minute}
              onValueChange={(m) => {
                setMinute(m)
                apply(draftDay, hour, m)
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MINUTES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
            {LABELS.done}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

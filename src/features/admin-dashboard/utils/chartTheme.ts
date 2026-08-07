import { useEffect, useState } from 'react'

export type ChartThemeColors = {
  brand: string
  brandSubtle: string
  ink: string
  inkMuted: string
  inkFaint: string
  line: string
  success: string
  warning: string
  danger: string
  surface: string
}

const FALLBACK: ChartThemeColors = {
  brand: '#8A6A2E',
  brandSubtle: '#F3ECDA',
  ink: '#1B1917',
  inkMuted: '#5C5750',
  inkFaint: '#9C968D',
  line: '#D8D1C2',
  success: '#2C4A6B',
  warning: '#9C5A12',
  danger: '#A13A32',
  surface: '#FFFFFF',
}

function readChartColors(): ChartThemeColors {
  if (typeof window === 'undefined') return FALLBACK
  const s = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback
  return {
    brand: read('--brand', FALLBACK.brand),
    brandSubtle: read('--brand-subtle', FALLBACK.brandSubtle),
    ink: read('--ink', FALLBACK.ink),
    inkMuted: read('--ink-muted', FALLBACK.inkMuted),
    inkFaint: read('--ink-faint', FALLBACK.inkFaint),
    line: read('--line', FALLBACK.line),
    success: read('--success', FALLBACK.success),
    warning: read('--warning', FALLBACK.warning),
    danger: read('--danger', FALLBACK.danger),
    surface: read('--surface', FALLBACK.surface),
  }
}

/** Resolve theme CSS variables for Recharts (SVG needs concrete colors). */
export function useChartThemeColors(): ChartThemeColors {
  const [colors, setColors] = useState<ChartThemeColors>(FALLBACK)

  useEffect(() => {
    setColors(readChartColors())

    const observer = new MutationObserver(() => setColors(readChartColors()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    })
    return () => observer.disconnect()
  }, [])

  return colors
}

export const STATUS_CHART_PALETTE = [
  'brand',
  'success',
  'warning',
  'danger',
  'inkMuted',
  'inkFaint',
] as const

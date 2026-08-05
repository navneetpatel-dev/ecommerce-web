'use client'

import { useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'

export function OtpCard() {
  const [digits, setDigits] = useState(Array.from({ length: 6 }, () => ''))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const completed = useMemo(() => digits.every(Boolean), [digits])

  const updateDigit = (index: number, nextValue: string) => {
    const sanitized = nextValue.replace(/\D/g, '').slice(0, 1)
    const next = [...digits]
    next[index] = sanitized
    setDigits(next)

    if (sanitized && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowRight' && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits.length)
    if (!pasted) return

    event.preventDefault()
    const next = Array.from({ length: digits.length }, (_, index) => pasted[index] ?? '')
    setDigits(next)

    const lastIndex = Math.min(pasted.length, digits.length) - 1
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus()
    }
  }

  return (
    <Card className="w-full max-w-[400px] border-line bg-surface shadow-elevation-1">
      <CardHeader>
        <CardTitle className="text-[1.75rem] font-display">Verify OTP</CardTitle>
        <CardDescription>Enter the 6-digit code sent to your email.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputRefs.current[index] = node
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => updateDigit(index, e.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              className="h-11 w-11 rounded-sm border border-line bg-surface text-center text-[0.9375rem] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[0.8125rem] text-ink-muted">Resend code in 00:30</span>
          <button type="button" className="text-[0.8125rem] text-brand hover:underline" disabled>
            Resend code
          </button>
        </div>
        <Button className="w-full" disabled={!completed}>Verify code</Button>
      </CardContent>
    </Card>
  )
}

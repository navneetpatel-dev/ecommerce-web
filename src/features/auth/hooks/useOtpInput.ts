'use client'

import { useMemo, useRef, useState } from 'react'

export function useOtpInput(length = 6) {
  const [digits, setDigits] = useState(Array.from({ length }, () => ''))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const completed = useMemo(() => digits.every(Boolean), [digits])

  const setInputRef = (index: number, node: HTMLInputElement | null) => {
    inputRefs.current[index] = node
  }

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

  return {
    digits,
    completed,
    setInputRef,
    updateDigit,
    handleKeyDown,
    handlePaste,
  }
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { navigate } from '@/shared/utils/navigate'
import { PATHS } from '@/shared/constants/paths'

export function useOtpInput(length = 6) {
  const router = useRouter()
  const [digits, setDigits] = useState(Array.from({ length }, () => ''))
  const [secondsLeft, setSecondsLeft] = useState(30)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const completed = useMemo(() => digits.every(Boolean), [digits])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  const setInputRef = (index: number, node: HTMLInputElement | null) => {
    inputRefs.current[index] = node
  }

  const updateDigit = (index: number, nextValue: string) => {
    const sanitized = nextValue.replace(/\D/g, '').slice(0, 1)
    const next = [...digits]
    next[index] = sanitized
    setDigits(next)
    setError(null)

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
    setError(null)

    const lastIndex = Math.min(pasted.length, digits.length) - 1
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus()
    }
  }

  const verify = async () => {
    if (!completed) return
    setIsVerifying(true)
    setError(null)
    // Auth OTP verify endpoint is not exposed yet — avoid a silent dead button.
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    setIsVerifying(false)
    setError('OTP verification is not available yet. Please sign in with your password.')
    window.setTimeout(() => navigate(router, PATHS.login), 1600)
  }

  const resend = () => {
    if (secondsLeft > 0) return
    setDigits(Array.from({ length }, () => ''))
    setSecondsLeft(30)
    setInfo('A new code has been requested. Check your email.')
    setError(null)
    inputRefs.current[0]?.focus()
  }

  const timerLabel =
    secondsLeft > 0
      ? `Resend code in 00:${String(secondsLeft).padStart(2, '0')}`
      : 'You can resend a code now'

  return {
    digits,
    completed,
    error,
    info,
    isVerifying,
    timerLabel,
    canResend: secondsLeft <= 0,
    setInputRef,
    updateDigit,
    handleKeyDown,
    handlePaste,
    verify,
    resend,
  }
}

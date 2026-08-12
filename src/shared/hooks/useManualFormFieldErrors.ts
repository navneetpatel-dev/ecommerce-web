'use client'

import { useState } from 'react'

/**
 * Per-field validation errors for forms that do not use react-hook-form.
 * Pair with FormFieldFrame `error` and control `error` props for uniform UI.
 */
export function useManualFormFieldErrors<T extends string>() {
  const [fieldErrors, setFieldErrorsState] = useState<Partial<Record<T, string>>>({})

  const clearAll = () => {
    setFieldErrorsState({})
  }

  const clearField = (name: T) => {
    setFieldErrorsState((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const setErrors = (errors: Partial<Record<T, string>>) => {
    setFieldErrorsState(errors)
  }

  const setFieldError = (name: T, message: string) => {
    setFieldErrorsState((prev) => ({ ...prev, [name]: message }))
  }

  const getError = (name: T) => fieldErrors[name]

  const hasError = (name: T) => Boolean(fieldErrors[name])

  return {
    fieldErrors,
    clearAll,
    clearField,
    setErrors,
    setFieldError,
    getError,
    hasError,
  }
}

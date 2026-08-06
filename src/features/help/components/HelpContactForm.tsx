'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormField } from '@/shared/components/FormField'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { CONTACT_TOPICS } from '../data/help-content'
import { useCreateHelpTicket } from '../api/help.queries'
import type { HelpTicketTopic } from '../api/help.api'

type ContactForm = {
  name: string
  email: string
  topic: HelpTicketTopic
  subject: string
  message: string
  orderId: string
}

export function HelpContactForm() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const createTicket = useCreateHelpTicket()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    defaultValues: {
      name: '',
      email: '',
      topic: 'ORDERS',
      subject: '',
      message: '',
      orderId: '',
    },
  })

  useEffect(() => {
    if (currentUser) {
      reset((prev) => ({
        ...prev,
        name: currentUser.name ?? '',
        email: currentUser.email ?? '',
      }))
    }
  }, [currentUser, reset])

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await createTicket.mutateAsync({
          name: data.name.trim(),
          email: data.email.trim(),
          topic: data.topic,
          subject: data.subject.trim(),
          message: data.message.trim(),
          orderId: data.orderId.trim() || null,
        })
        reset({
          name: currentUser?.name ?? data.name,
          email: currentUser?.email ?? data.email,
          topic: 'ORDERS',
          subject: '',
          message: '',
          orderId: '',
        })
      })}
      className="max-w-xl space-y-4"
    >
      <FormField
        id="help-name"
        label="Name"
        registration={register('name', { required: 'Name is required' })}
        error={errors.name}
      />
      <FormField
        id="help-email"
        label="Email"
        type="email"
        registration={register('email', { required: 'Email is required' })}
        error={errors.email}
      />
      <div className="space-y-1.5">
        <Label htmlFor="help-topic">Topic</Label>
        <select
          id="help-topic"
          className="flex h-11 w-full border border-line bg-surface px-3 text-[0.9375rem] text-ink"
          {...register('topic', { required: true })}
        >
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
      </div>
      <FormField
        id="help-subject"
        label="Subject"
        registration={register('subject', {
          required: 'Subject is required',
          minLength: { value: 3, message: 'At least 3 characters' },
        })}
        error={errors.subject}
      />
      <FormField
        id="help-order"
        label="Order ID (optional)"
        registration={register('orderId')}
        error={errors.orderId}
        helperText="Paste the full order ID from your order details page if relevant."
      />
      <div className="space-y-1.5">
        <Label htmlFor="help-message">Message</Label>
        <textarea
          id="help-message"
          rows={6}
          className="w-full border border-line bg-surface px-3 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-faint"
          placeholder="What happened, what you expected, and any error messages you saw."
          {...register('message', {
            required: 'Please describe the issue',
            minLength: { value: 20, message: 'Please add a bit more detail (20+ characters)' },
          })}
        />
        {errors.message ? (
          <p className="text-[0.8125rem] text-danger">{errors.message.message}</p>
        ) : null}
      </div>

      <FormError
        error={createTicket.error as Error | null}
        fallback="Could not send your message. Please try again."
      />
      {createTicket.isSuccess ? (
        <p className="text-[0.875rem] text-success">
          Ticket received. We’ll reply to your email as soon as we can.
        </p>
      ) : null}

      <Button type="submit" loading={createTicket.isPending}>
        Send message
      </Button>
    </form>
  )
}

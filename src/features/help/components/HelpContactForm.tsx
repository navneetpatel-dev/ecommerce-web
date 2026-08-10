'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormError } from '@/shared/components/FormError'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { LABELS } from '@/shared/constants/labels'
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
    control,
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
      className="max-w-2xl"
    >
      <FormStack>
        <FormSection title={LABELS.helpContactSection} hint={LABELS.helpContactSectionHint}>
          <FormFieldFrame
            label={LABELS.helpName}
            htmlFor="help-name"
            required
            error={errors.name?.message}
          >
            <Input
              id="help-name"
              {...register('name', { required: LABELS.nameRequired })}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.helpEmail}
            htmlFor="help-email"
            required
            error={errors.email?.message}
          >
            <Input
              id="help-email"
              type="email"
              {...register('email', { required: LABELS.helpEmailRequired })}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.helpTopic} htmlFor="help-topic" required>
            <Controller
              name="topic"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="help-topic">
                    <SelectValue placeholder={LABELS.helpTopic} />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_TOPICS.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.helpSubject}
            htmlFor="help-subject"
            required
            error={errors.subject?.message}
          >
            <Input
              id="help-subject"
              {...register('subject', {
                required: LABELS.helpSubjectRequired,
                minLength: { value: 3, message: LABELS.helpSubjectMinLength },
              })}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.helpOrderIdOptional}
            htmlFor="help-order"
            hint={LABELS.helpOrderIdHint}
            className="sm:col-span-2"
          >
            <Input id="help-order" {...register('orderId')} />
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.helpContactMessageSection}
          hint={LABELS.helpContactMessageSectionHint}
          columns={1}
        >
          <FormFieldFrame
            label={LABELS.helpMessage}
            htmlFor="help-message"
            required
            error={errors.message?.message}
          >
            <Textarea
              id="help-message"
              rows={6}
              placeholder={LABELS.helpMessagePlaceholder}
              {...register('message', {
                required: LABELS.helpMessageRequired,
                minLength: { value: 20, message: LABELS.helpMessageMinLength },
              })}
            />
          </FormFieldFrame>
        </FormSection>

        <FormError error={createTicket.error as Error | null} fallback={LABELS.helpCouldNotSend} />
        {createTicket.isSuccess ? (
          <p className="text-[0.875rem] text-success">{LABELS.helpTicketReceived}</p>
        ) : null}

        <FormActions>
          <Button type="submit" loading={createTicket.isPending}>
            {LABELS.helpSendMessage}
          </Button>
        </FormActions>
      </FormStack>
    </form>
  )
}

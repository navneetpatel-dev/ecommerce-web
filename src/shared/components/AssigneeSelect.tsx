'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { adminUsersApi } from '@/features/admin-dashboard/api/users.api'
import { LABELS } from '@/shared/constants/labels'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/utils/cn'

const NONE_VALUE = '__none__'

type AssigneePermission =
  | typeof PERMISSIONS.TICKET_MANAGE
  | typeof PERMISSIONS.BUG_REPORT_MANAGE

type Props = {
  permission: AssigneePermission
  value: string
  onChange: (userId: string) => void
  /** Keep a current assignee visible even if they are not in the eligible list. */
  currentOption?: { id: string; name: string; email?: string | null } | null
  allowNone?: boolean
  noneLabel?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

function formatAssignee(user: { name: string; email?: string | null }): string {
  if (user.email) return `${user.name} (${user.email})`
  return user.name
}

export function AssigneeSelect({
  permission,
  value,
  onChange,
  currentOption,
  allowNone = false,
  noneLabel = LABELS.ticketAssigneeNone,
  placeholder = LABELS.ticketAssigneePlaceholder,
  disabled,
  className,
}: Props) {
  const query = useQuery({
    queryKey: ['users', 'assignees', permission],
    queryFn: () => adminUsersApi.listAssignees(permission),
    staleTime: 60_000,
  })

  const assignees = useMemo(() => {
    const rows = [...(query.data ?? [])]
    if (currentOption?.id && !rows.some((u) => u.id === currentOption.id)) {
      rows.unshift({
        id: currentOption.id,
        name: currentOption.name,
        email: currentOption.email ?? '',
      })
    }
    return rows
  }, [query.data, currentOption])

  const selectValue = value || (allowNone ? NONE_VALUE : undefined)

  if (query.isLoading) {
    return <Skeleton className={cn('h-10 w-full', className)} />
  }

  return (
    <Select
      value={selectValue}
      disabled={disabled || query.isError}
      onValueChange={(next) => {
        if (next === NONE_VALUE) {
          onChange('')
          return
        }
        onChange(next)
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowNone ? <SelectItem value={NONE_VALUE}>{noneLabel}</SelectItem> : null}
        {assignees.length === 0 ? (
          <SelectItem value="__empty__" disabled>
            {LABELS.ticketAssigneesEmpty}
          </SelectItem>
        ) : (
          assignees.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {formatAssignee(user)}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

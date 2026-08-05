'use client'

import { useChatWidget } from '@/shared/hooks/useChatWidget'
import { ChatWidget } from '@/shared/components/ChatWidget'

export function ChatWidgetContainer() {
  const chat = useChatWidget()

  return (
    <ChatWidget
      open={chat.open}
      onToggle={chat.toggle}
      onClose={chat.close}
    />
  )
}

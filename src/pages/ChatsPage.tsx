import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react'
import { cn, formatTime, getInitials } from '@/lib/utils'
import { useChatStore } from '@/stores/chatStore'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { EmptyState } from '@/components/shared/EmptyState'

export default function ChatsPage() {
  const user = useAuthStore((s) => s.user)
  const { requests, fetchRequests, isLoading: requestsLoading } = useTaskStore()
  const { messages, activeRequestId, isLoading: chatLoading, openChat, closeChat, sendMessage } = useChatStore()
  const isMobile = useIsMobile()

  const [input, setInput] = useState('')
  const [sendError, setSendError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Only show requests where the current user is creator or has sent a message
  // For simplicity: show all open requests as potential chats
  const chatRooms = requests.filter((r) => r.status !== 'closed')

  useEffect(() => {
    fetchRequests()
    return () => closeChat()
  }, [fetchRequests, closeChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  useEffect(() => {
    if (activeRequestId) inputRef.current?.focus()
  }, [activeRequestId])

  const handleSend = async () => {
    if (!input.trim() || !activeRequestId || !user) return
    setSendError('')
    const text = input.trim()
    setInput('')
    try {
      await sendMessage(activeRequestId, user.id, text)
    } catch {
      setSendError('Не удалось отправить сообщение')
      setInput(text)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const activeRoom = chatRooms.find((r) => r.id === activeRequestId)
  const showList = !isMobile || !activeRequestId

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Room list */}
      {showList && (
        <div
          className={cn(
            'flex flex-col border-r border-border bg-card',
            isMobile ? 'w-full' : 'w-80 shrink-0'
          )}
        >
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold">Чаты по запросам</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Выберите запрос для общения</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {requestsLoading ? (
              <div className="p-4 text-sm text-muted-foreground">Загрузка...</div>
            ) : chatRooms.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Нет активных запросов
              </div>
            ) : (
              chatRooms.map((room) => {
                const isActive = room.id === activeRequestId
                const authorName = room.profiles
                  ? `${room.profiles.first_name} ${room.profiles.last_name}`
                  : 'Аноним'
                const avatar =
                  room.profiles?.avatar_url ??
                  `https://api.dicebear.com/9.x/notionists/svg?seed=${room.creator_id}&backgroundColor=c0aede`

                return (
                  <button
                    key={room.id}
                    onClick={() => openChat(room.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors',
                      isActive && 'bg-white/[0.05]'
                    )}
                  >
                    <img
                      src={avatar}
                      alt=""
                      className="w-10 h-10 rounded-full bg-muted shrink-0"
                      onError={(e) => {
                        const t = e.currentTarget
                        t.style.display = 'none'
                        const fallback = t.nextElementSibling as HTMLElement | null
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 items-center justify-center text-xs font-bold shrink-0 hidden"
                    >
                      {getInitials(authorName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{room.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{authorName}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Chat window */}
      {activeRequestId && activeRoom ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 lg:px-6 py-3 border-b border-border bg-card">
            {isMobile && (
              <button onClick={() => closeChat()} className="p-1.5 rounded-lg hover:bg-muted">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <p className="text-sm font-semibold line-clamp-1">{activeRoom.title}</p>
              <p className="text-xs text-muted-foreground">
                {activeRoom.profiles
                  ? `${activeRoom.profiles.first_name} ${activeRoom.profiles.last_name}`
                  : 'Аноним'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-3">
            {chatLoading ? (
              <p className="text-sm text-muted-foreground text-center pt-8">Загрузка сообщений...</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center pt-8">
                Начните общение первым!
              </p>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender_id === user?.id
                const senderName = msg.profiles
                  ? `${msg.profiles.first_name} ${msg.profiles.last_name}`
                  : 'Аноним'

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn('flex', isMine ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm',
                        isMine
                          ? 'bg-emerald-600 text-white rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      )}
                    >
                      {!isMine && (
                        <p className="text-[10px] font-medium mb-1 text-emerald-400">{senderName}</p>
                      )}
                      <p>{msg.text}</p>
                      <p className={cn('text-[10px] mt-1', isMine ? 'text-white/60' : 'text-muted-foreground')}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </motion.div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 lg:px-6 py-3 border-t border-border bg-card">
            {sendError && (
              <p className="text-xs text-red-400 flex items-center gap-1 mb-2">
                <AlertCircle className="w-3 h-3" />{sendError}
              </p>
            )}
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Написать сообщение..."
                className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        !isMobile && (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MessageCircle}
              title="Выберите запрос"
              description="Нажмите на запрос слева, чтобы открыть чат"
            />
          </div>
        )
      )}
    </div>
  )
}

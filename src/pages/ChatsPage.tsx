import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, Search, MessageCircle } from 'lucide-react'
import { cn, timeAgo, getInitials, formatTime } from '@/lib/utils'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { mockUsers } from '@/data/mock'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { EmptyState } from '@/components/shared/EmptyState'

export default function ChatsPage() {
  const user = useAuthStore((s) => s.user)
  const { conversations, messages, activeConversationId, setActiveConversation, sendMessage, isTyping } = useChatStore()
  const isMobile = useIsMobile()
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeConv = conversations.find((c) => c.id === activeConversationId)
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : []

  const filteredConversations = conversations.filter((conv) => {
    if (!search) return true
    const other = mockUsers.find((u) => conv.participants.includes(u.id) && u.id !== user?.id)
    return other?.name.toLowerCase().includes(search.toLowerCase())
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages.length])

  useEffect(() => {
    if (activeConversationId) inputRef.current?.focus()
  }, [activeConversationId])

  const handleSend = () => {
    if (!input.trim() || !activeConversationId || !user) return
    sendMessage(activeConversationId, input.trim(), user.id)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getOtherUser = (participantIds: string[]) => {
    return mockUsers.find((u) => participantIds.includes(u.id) && u.id !== user?.id)
  }

  const showConversationList = !isMobile || !activeConversationId

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation list */}
      <AnimatePresence>
        {showConversationList && (
          <motion.div
            initial={isMobile ? { x: '-100%' } : false}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className={cn(
              'flex flex-col border-r border-border bg-card',
              isMobile ? 'w-full' : 'w-80 shrink-0'
            )}
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold mb-3">Чаты</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Нет диалогов
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = getOtherUser(conv.participants)
                  const isActive = conv.id === activeConversationId
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface transition-colors',
                        isActive && 'bg-white/[0.05]'
                      )}
                    >
                      <div className="relative shrink-0">
                        {other?.avatar ? (
                          <img src={other.avatar} alt="" className="w-10 h-10 rounded-full bg-muted" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold">
                            {other ? getInitials(other.name) : '?'}
                          </div>
                        )}
                        {other?.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{other?.name}</p>
                          {conv.lastMessage && (
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                              {formatTime(conv.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage
                              ? conv.lastMessage.senderId === user?.id
                                ? `Вы: ${conv.lastMessage.text}`
                                : conv.lastMessage.text
                              : 'Нет сообщений'}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="ml-2 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-[10px] font-bold text-white shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      {activeConversationId && activeConv ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          {(() => {
            const other = getOtherUser(activeConv.participants)
            return (
              <div className="flex items-center gap-3 px-4 lg:px-6 py-3 border-b border-border bg-card">
                {isMobile && (
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="p-1.5 rounded-lg hover:bg-muted"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="relative">
                  {other?.avatar ? (
                    <img src={other.avatar} alt="" className="w-9 h-9 rounded-full bg-muted" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold">
                      {other ? getInitials(other.name) : '?'}
                    </div>
                  )}
                  {other?.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{other?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {other?.isOnline ? 'Онлайн' : `Был(а) ${timeAgo(other?.lastSeen || '')}`}
                  </p>
                </div>
              </div>
            )
          })()}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-3">
            {activeMessages.map((msg) => {
              const isMine = msg.senderId === user?.id
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
                    <p>{msg.text}</p>
                    <p className={cn('text-[10px] mt-1', isMine ? 'text-white/60' : 'text-muted-foreground')}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </motion.div>
              )
            })}

            {/* Typing indicator */}
            {isTyping[activeConversationId] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot-1" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot-2" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot-3" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 lg:px-6 py-3 border-t border-border bg-card">
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
              title="Выберите диалог"
              description="Нажмите на диалог слева, чтобы начать общение"
            />
          </div>
        )
      )}
    </div>
  )
}

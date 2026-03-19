import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, MessageCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { CATEGORY_LABELS, URGENCY_LABELS } from '@/types'
import { EmptyState } from '@/components/shared/EmptyState'

// In the new schema, "responses" are handled via the chat (messages table).
// This page shows open requests from OTHER users that the current user can help with.
export default function MyResponsesPage() {
  const { requests, fetchRequests, isLoading } = useTaskStore()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Requests created by others that are still open
  const available = requests.filter(
    (r) => r.creator_id !== user?.id && r.status === 'open'
  )

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Помочь другим</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Открытые запросы от других пользователей — напишите в чат, чтобы предложить помощь
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      ) : available.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Нет доступных запросов"
          description="Все запросы закрыты или вы единственный пользователь"
          action={
            <Link
              to="/feed"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              Перейти в ленту
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {available.map((req, i) => {
            const authorName = req.profiles
              ? `${req.profiles.first_name} ${req.profiles.last_name}`
              : 'Аноним'
            const avatar =
              req.profiles?.avatar_url ??
              `https://api.dicebear.com/9.x/notionists/svg?seed=${req.creator_id}&backgroundColor=c0aede`

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{req.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                  </div>
                  <div className="text-right shrink-0 text-xs text-muted-foreground">
                    <p>{URGENCY_LABELS[req.urgency]}</p>
                    <p>до {formatDate(req.deadline)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <img src={avatar} alt="" className="w-5 h-5 rounded-full bg-muted" />
                    <span className="text-xs text-muted-foreground">{authorName}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[req.category]}</span>
                  </div>
                  <Link
                    to="/chats"
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Написать
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  MessageCircle,
  Clock,
  Star,
} from 'lucide-react'
import { formatDate, timeAgo, getInitials } from '@/lib/utils'
import { useTaskStore } from '@/stores/taskStore'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { CATEGORY_LABELS } from '@/types'
import { TaskStatusBadge, UrgencyBadge } from '@/components/tasks/TaskStatusBadge'

export default function TaskPage() {
  const { id } = useParams<{ id: string }>()
  const { requests, fetchRequests } = useTaskStore()
  const { openChat, activeRequestId } = useChatStore()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!requests.length) fetchRequests()
  }, [requests.length, fetchRequests])

  const req = requests.find((r) => r.id === id)

  if (!req) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        <p className="text-muted-foreground">Запрос не найден</p>
      </div>
    )
  }

  const authorName = req.profiles
    ? `${req.profiles.first_name} ${req.profiles.last_name}`
    : 'Аноним'
  const avatar =
    req.profiles?.avatar_url ??
    `https://api.dicebear.com/9.x/notionists/svg?seed=${req.creator_id}&backgroundColor=c0aede`

  const isAuthor = user?.id === req.creator_id
  const chatOpen = activeRequestId === req.id

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
      <Link
        to="/feed"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Назад к ленте
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-bold leading-snug">{req.title}</h1>
              <UrgencyBadge urgency={req.urgency} />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                {CATEGORY_LABELS[req.category]}
              </span>
              <TaskStatusBadge status={req.status} />
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-foreground/80">
                {req.is_online ? <><Globe className="w-3 h-3" /> Онлайн</> : <><MapPin className="w-3 h-3" /> Оффлайн</>}
              </span>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{req.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> до {formatDate(req.deadline)}
              </span>
              {req.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {req.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {timeAgo(req.created_at)}
              </span>
            </div>
          </div>

          {/* Chat panel */}
          {!isAuthor && req.status === 'open' && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold mb-3">Предложить помощь</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Откройте чат с автором запроса, чтобы обсудить детали и предложить свою помощь.
              </p>
              <Link
                to="/chats"
                onClick={() => openChat(req.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                {chatOpen ? 'Продолжить чат' : 'Открыть чат'}
              </Link>
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Author card */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Автор запроса</p>
            <div className="flex items-center gap-3">
              {req.profiles?.avatar_url ? (
                <img src={avatar} alt="" className="w-12 h-12 rounded-full bg-muted" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-sm font-bold">
                  {getInitials(authorName)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">{authorName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-muted-foreground">{req.profiles?.rating ?? 0} баллов</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          {!isAuthor && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <Link
                to="/chats"
                onClick={() => openChat(req.id)}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-muted hover:bg-accent transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Написать автору
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

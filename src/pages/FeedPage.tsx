import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusCircle, Inbox, AlertCircle } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { EmptyState } from '@/components/shared/EmptyState'
import { TaskCardSkeleton } from '@/components/shared/LoadingSkeleton'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS, URGENCY_LABELS } from '@/types'
import type { HelpRequest } from '@/types'

const URGENCY_COLOR: Record<string, string> = {
  urgent: 'text-red-400 bg-red-500/10',
  high: 'text-orange-400 bg-orange-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  low: 'text-emerald-400 bg-emerald-500/10',
}

function RequestCard({ req, index }: { req: HelpRequest; index: number }) {
  const authorName = req.profiles
    ? `${req.profiles.first_name} ${req.profiles.last_name}`
    : 'Аноним'
  const avatar =
    req.profiles?.avatar_url ??
    `https://api.dicebear.com/9.x/notionists/svg?seed=${req.creator_id}&backgroundColor=c0aede`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 hover:border-emerald-500/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">{req.title}</h3>
        <span
          className={cn(
            'shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full',
            URGENCY_COLOR[req.urgency]
          )}
        >
          {URGENCY_LABELS[req.urgency]}
        </span>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">{req.description}</p>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-2">
          <img src={avatar} alt="" className="w-6 h-6 rounded-full bg-muted" />
          <span className="text-xs text-muted-foreground">{authorName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {CATEGORY_LABELS[req.category]}
          </span>
          <span className="text-[11px] text-muted-foreground">
            до {new Date(req.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      <Link
        to={`/task/${req.id}`}
        className="mt-1 text-center text-xs font-medium py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
      >
        Подробнее
      </Link>
    </motion.div>
  )
}

export default function FeedPage() {
  const { fetchRequests, getFiltered, isLoading, error } = useTaskStore()
  const requests = getFiltered()

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Лента запросов</h1>
          {!isLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-sm text-muted-foreground"
            >
              {requests.length === 0 ? 'Нет запросов' : `${requests.length} ${pluralize(requests.length)}`}
            </motion.p>
          )}
        </div>
        <Link
          to="/create-task"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Создать запрос
        </Link>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Запросы не найдены"
          description="Будьте первым — создайте запрос о помощи."
          action={
            <Link
              to="/create-task"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              <PlusCircle className="w-4 h-4" /> Создать запрос
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map((req, i) => (
            <RequestCard key={req.id} req={req} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function pluralize(count: number) {
  const m = count % 10
  const h = count % 100
  if (m === 1 && h !== 11) return 'запрос'
  if (m >= 2 && m <= 4 && (h < 12 || h > 14)) return 'запроса'
  return 'запросов'
}

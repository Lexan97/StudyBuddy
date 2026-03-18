import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Send,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRightLeft,
  Calendar,
} from 'lucide-react'
import { cn, formatDate, timeAgo, getInitials } from '@/lib/utils'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { CATEGORY_LABELS } from '@/types'
import { EmptyState } from '@/components/shared/EmptyState'
import { mockUsers } from '@/data/mock'
import type { ResponseStatus } from '@/types'

type Tab = 'all' | ResponseStatus

export default function MyResponsesPage() {
  const tasks = useTaskStore((s) => s.tasks)
  const user = useAuthStore((s) => s.user)
  const [tab, setTab] = useState<Tab>('all')

  const myResponses = tasks
    .flatMap((task) =>
      task.responses
        .filter((r) => r.userId === user?.id)
        .map((r) => ({ ...r, task }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filtered = tab === 'all' ? myResponses : myResponses.filter((r) => r.status === tab)

  const tabs: { key: Tab; label: string; icon: typeof Send; count: number }[] = [
    { key: 'all', label: 'Все', icon: Send, count: myResponses.length },
    { key: 'pending', label: 'Ожидают', icon: Clock, count: myResponses.filter((r) => r.status === 'pending').length },
    { key: 'accepted', label: 'Приняты', icon: CheckCircle, count: myResponses.filter((r) => r.status === 'accepted').length },
    { key: 'rejected', label: 'Отклонены', icon: XCircle, count: myResponses.filter((r) => r.status === 'rejected').length },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Мои отклики</h1>
        <p className="text-sm text-muted-foreground mt-1">Ваши отклики на задачи других студентов</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              tab === t.key ? 'text-white' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === t.key && (
              <motion.div
                layoutId="responses-tab"
                className="absolute inset-0 bg-muted rounded-lg"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative">
              {t.label} <span className="text-muted-foreground">({t.count})</span>
            </span>
          </button>
        ))}
      </div>

      {/* Responses */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Нет откликов"
          description="Откликайтесь на задачи в ленте, чтобы помогать другим студентам"
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
          {filtered.map((resp, i) => {
            const author = mockUsers.find((u) => u.id === resp.task.authorId)
            return (
              <motion.div
                key={resp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/task/${resp.task.id}`}
                  className="block rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
                            resp.status === 'pending' && 'bg-yellow-500/10 text-yellow-400',
                            resp.status === 'accepted' && 'bg-emerald-500/10 text-emerald-400',
                            resp.status === 'rejected' && 'bg-red-500/10 text-red-400'
                          )}
                        >
                          {resp.status === 'pending' && <><Clock className="w-2.5 h-2.5" /> Ожидает</>}
                          {resp.status === 'accepted' && <><CheckCircle className="w-2.5 h-2.5" /> Принят</>}
                          {resp.status === 'rejected' && <><XCircle className="w-2.5 h-2.5" /> Отклонён</>}
                        </span>
                        {resp.isExchangeOffer && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400">
                            <ArrowRightLeft className="w-2.5 h-2.5" /> Обмен
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold truncate">{resp.task.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{resp.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(resp.task.deadline)}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 block">{timeAgo(resp.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    {author?.avatar ? (
                      <img src={author.avatar} alt="" className="w-5 h-5 rounded-full bg-muted" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[8px] font-bold">
                        {author ? getInitials(author.name) : '?'}
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{author?.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{CATEGORY_LABELS[resp.task.category]}</span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusCircle, ClipboardList } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { EmptyState } from '@/components/shared/EmptyState'
import { CATEGORY_LABELS, URGENCY_LABELS } from '@/types'
import type { HelpRequestStatus } from '@/types'

type Tab = 'all' | HelpRequestStatus

export default function MyTasksPage() {
  const { requests, fetchRequests, isLoading } = useTaskStore()
  const user = useAuthStore((s) => s.user)
  const [tab, setTab] = useState<Tab>('all')

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const mine = requests.filter((r) => r.creator_id === user?.id)
  const filtered = tab === 'all' ? mine : mine.filter((r) => r.status === tab)

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'Все', count: mine.length },
    { key: 'open', label: 'Открытые', count: mine.filter((r) => r.status === 'open').length },
    { key: 'in_progress', label: 'В работе', count: mine.filter((r) => r.status === 'in_progress').length },
    { key: 'closed', label: 'Закрытые', count: mine.filter((r) => r.status === 'closed').length },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Мои запросы</h1>
          <p className="text-sm text-muted-foreground mt-1">Запросы, которые вы создали</p>
        </div>
        <Link
          to="/create-task"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Создать
        </Link>
      </div>

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
                layoutId="mytasks-tab"
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

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Нет запросов"
          description="Создайте свой первый запрос и получите помощь"
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
          {filtered.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border bg-card p-5 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold line-clamp-2">{req.title}</h3>
                <span className={cn(
                  'shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium',
                  req.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' :
                  req.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-zinc-500/10 text-zinc-400'
                )}>
                  {req.status === 'open' ? 'Открыт' : req.status === 'in_progress' ? 'В работе' : 'Закрыт'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{req.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>{CATEGORY_LABELS[req.category]}</span>
                <span>{URGENCY_LABELS[req.urgency]} · до {formatDate(req.deadline)}</span>
              </div>
              <Link
                to={`/task/${req.id}`}
                className="block text-center text-xs font-medium py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors mt-1"
              >
                Открыть
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

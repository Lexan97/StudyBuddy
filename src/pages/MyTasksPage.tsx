import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusCircle, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { TaskCard } from '@/components/tasks/TaskCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { TaskStatus } from '@/types'

type Tab = 'all' | TaskStatus

export default function MyTasksPage() {
  const tasks = useTaskStore((s) => s.tasks)
  const user = useAuthStore((s) => s.user)
  const [tab, setTab] = useState<Tab>('all')

  const myTasks = tasks.filter((t) => t.authorId === user?.id)
  const filtered = tab === 'all' ? myTasks : myTasks.filter((t) => t.status === tab)

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'Все', count: myTasks.length },
    { key: 'open', label: 'Открытые', count: myTasks.filter((t) => t.status === 'open').length },
    { key: 'in_progress', label: 'В работе', count: myTasks.filter((t) => t.status === 'in_progress').length },
    { key: 'closed', label: 'Закрытые', count: myTasks.filter((t) => t.status === 'closed').length },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Мои задачи</h1>
          <p className="text-sm text-muted-foreground mt-1">Задачи, которые вы создали</p>
        </div>
        <Link
          to="/create-task"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Создать
        </Link>
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

      {/* Tasks */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Нет задач"
          description="Создайте свою первую задачу и получите помощь от других студентов"
          action={
            <Link
              to="/create-task"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Создать задачу
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

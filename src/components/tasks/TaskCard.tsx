import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Users,
  ArrowRightLeft,
  Globe,
  MessageCircle,
  Clock,
} from 'lucide-react'
import { cn, formatDate, timeAgo, getInitials } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/types'
import type { Task } from '@/types'
import { TaskStatusBadge, UrgencyBadge } from './TaskStatusBadge'
import { mockUsers } from '@/data/mock'

interface TaskCardProps {
  task: Task
  index?: number
}

export function TaskCard({ task, index = 0 }: TaskCardProps) {
  const author = mockUsers.find((u) => u.id === task.authorId)
  const spotsLeft = task.maxExecutors - task.acceptedExecutors.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/task/${task.id}`}
        className="block group"
      >
        <div className="rounded-2xl border border-border bg-card hover:bg-surface hover:border-border transition-all duration-300 p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-base font-semibold leading-snug group-hover:text-white transition-colors line-clamp-2">
              {task.title}
            </h3>
            <UrgencyBadge urgency={task.urgency} />
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{task.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
              {CATEGORY_LABELS[task.category]}
            </span>
            <TaskStatusBadge status={task.status} />
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-foreground/80">
              {task.format === 'online' ? (
                <><Globe className="w-3 h-3" /> Онлайн</>
              ) : (
                <><MapPin className="w-3 h-3" /> Оффлайн</>
              )}
            </span>
            {task.allowExchange && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                <ArrowRightLeft className="w-3 h-3" /> Обмен
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              до {formatDate(task.deadline)}
            </span>
            {task.format === 'offline' && task.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {task.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {task.maxExecutors > 1
                ? `${spotsLeft} из ${task.maxExecutors} мест`
                : '1 исполнитель'}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {task.responses.length} откликов
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(task.createdAt)}
            </span>
          </div>

          {/* Footer: author + action */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2.5">
              {author?.avatar ? (
                <img src={author.avatar} alt="" className="w-7 h-7 rounded-full bg-muted" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-bold">
                  {author ? getInitials(author.name) : '?'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{author?.name ?? 'Аноним'}</p>
                <p className="text-xs text-muted-foreground">{author?.university}</p>
              </div>
            </div>

            <div
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                task.status === 'open'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white group-hover:shadow-lg group-hover:shadow-emerald-500/20'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {task.status === 'open' ? 'Откликнуться' : 'Подробнее'}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

import { cn } from '@/lib/utils'
import type { TaskStatus, TaskUrgency } from '@/types'
import { STATUS_LABELS, URGENCY_LABELS } from '@/types'

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        status === 'open' && 'bg-emerald-500/10 text-emerald-400',
        status === 'in_progress' && 'bg-sky-500/10 text-sky-500',
        status === 'closed' && 'bg-zinc-500/10 text-zinc-400'
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'open' && 'bg-emerald-400',
          status === 'in_progress' && 'bg-sky-500',
          status === 'closed' && 'bg-zinc-400'
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  )
}

export function UrgencyBadge({ urgency }: { urgency: TaskUrgency }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        urgency === 'low' && 'bg-zinc-500/10 text-zinc-400',
        urgency === 'medium' && 'bg-yellow-500/10 text-yellow-400',
        urgency === 'high' && 'bg-orange-500/10 text-orange-400',
        urgency === 'urgent' && 'bg-red-500/10 text-red-400 animate-pulse'
      )}
    >
      {URGENCY_LABELS[urgency]}
    </span>
  )
}

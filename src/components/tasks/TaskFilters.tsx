import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/stores/taskStore'
import { CATEGORY_LABELS, URGENCY_LABELS } from '@/types'
import type { TaskCategory, TaskUrgency } from '@/types'

export function TaskFilters() {
  const { filters, setFilters, resetFilters } = useTaskStore()
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.urgency !== 'all' ||
    filters.format !== 'all'

  return (
    <div className="space-y-4">
      {/* Search + filter toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск задач..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all',
            showFilters || hasActiveFilters
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-border bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Фильтры</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              {/* Sort */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Сортировка
                </label>
                <div className="flex gap-2">
                  {([['newest', 'Новые'], ['urgent', 'Срочные']] as const).map(
                    ([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setFilters({ sortBy: value })}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                          filters.sortBy === value
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Категория
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilters({ category: 'all' })}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      filters.category === 'all'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Все
                  </button>
                  {(Object.entries(CATEGORY_LABELS) as [TaskCategory, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setFilters({ category: key })}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        filters.category === key
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Срочность
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilters({ urgency: 'all' })}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      filters.urgency === 'all'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Все
                  </button>
                  {(Object.entries(URGENCY_LABELS) as [TaskUrgency, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setFilters({ urgency: key })}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        filters.urgency === key
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Формат
                </label>
                <div className="flex gap-2">
                  {([['all', 'Все'], ['online', 'Онлайн'], ['offline', 'Оффлайн']] as ['all' | 'online' | 'offline', string][]).map(
                    ([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setFilters({ format: value })}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                          filters.format === value
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Сбросить фильтры
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

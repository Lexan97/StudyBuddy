import { create } from 'zustand'
import type { Task, TaskCategory, TaskUrgency, TaskFormat, TaskResponse } from '@/types'
import { mockTasks } from '@/data/mock'

interface TaskFilters {
  search: string
  category: TaskCategory | 'all'
  urgency: TaskUrgency | 'all'
  format: TaskFormat | 'all'
  exchangeOnly: boolean
  sortBy: 'newest' | 'urgent' | 'popular'
}

interface TaskState {
  tasks: Task[]
  filters: TaskFilters
  isLoading: boolean
  setFilters: (filters: Partial<TaskFilters>) => void
  resetFilters: () => void
  addTask: (task: Task) => void
  updateTask: (id: string, data: Partial<Task>) => void
  addResponse: (taskId: string, response: TaskResponse) => void
  acceptResponse: (taskId: string, responseId: string) => void
  getFilteredTasks: () => Task[]
}

const defaultFilters: TaskFilters = {
  search: '',
  category: 'all',
  urgency: 'all',
  format: 'all',
  exchangeOnly: false,
  sortBy: 'newest',
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: mockTasks,
  filters: defaultFilters,
  isLoading: false,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }))
  },

  resetFilters: () => set({ filters: defaultFilters }),

  addTask: (task) => {
    set((state) => ({ tasks: [task, ...state.tasks] }))
  },

  updateTask: (id, data) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }))
  },

  addResponse: (taskId, response) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, responses: [...t.responses, response] } : t
      ),
    }))
  },

  acceptResponse: (taskId, responseId) => {
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== taskId) return t
        const updatedResponses = t.responses.map((r) =>
          r.id === responseId ? { ...r, status: 'accepted' as const } : r
        )
        const acceptedResp = t.responses.find((r) => r.id === responseId)
        const newAccepted = acceptedResp
          ? [...t.acceptedExecutors, acceptedResp.userId]
          : t.acceptedExecutors
        return {
          ...t,
          responses: updatedResponses,
          acceptedExecutors: newAccepted,
          status: newAccepted.length >= t.maxExecutors ? 'in_progress' as const : t.status,
        }
      }),
    }))
  },

  getFilteredTasks: () => {
    const { tasks, filters } = get()
    let filtered = [...tasks]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      )
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter((t) => t.category === filters.category)
    }
    if (filters.urgency !== 'all') {
      filtered = filtered.filter((t) => t.urgency === filters.urgency)
    }
    if (filters.format !== 'all') {
      filtered = filtered.filter((t) => t.format === filters.format)
    }
    if (filters.exchangeOnly) {
      filtered = filtered.filter((t) => t.allowExchange)
    }

    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'urgent':
        const urgencyOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        filtered.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])
        break
      case 'popular':
        filtered.sort((a, b) => b.responses.length - a.responses.length)
        break
    }

    return filtered
  },
}))

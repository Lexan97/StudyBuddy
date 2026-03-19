import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { HelpRequest, HelpRequestCategory, HelpRequestUrgency, HelpRequestStatus } from '@/types'

interface TaskFilters {
  search: string
  category: HelpRequestCategory | 'all'
  urgency: HelpRequestUrgency | 'all'
  format: 'online' | 'offline' | 'all'
  sortBy: 'newest' | 'urgent'
}

interface TaskState {
  requests: HelpRequest[]
  filters: TaskFilters
  isLoading: boolean
  error: string | null
  setFilters: (filters: Partial<TaskFilters>) => void
  resetFilters: () => void
  fetchRequests: () => Promise<void>
  createRequest: (data: {
    title: string
    description: string
    deadline: string
    urgency: HelpRequestUrgency
    category: HelpRequestCategory
    is_online: boolean
    location: string | null
    creator_id: string
  }) => Promise<HelpRequest>
  updateStatus: (id: string, status: HelpRequestStatus) => Promise<void>
  getFiltered: () => HelpRequest[]
}

const defaultFilters: TaskFilters = {
  search: '',
  category: 'all',
  urgency: 'all',
  format: 'all',
  sortBy: 'newest',
}

export const useTaskStore = create<TaskState>((set, get) => ({
  requests: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,

  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: defaultFilters }),

  fetchRequests: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await supabase
      .from('help_requests')
      .select('*, profiles(id, first_name, last_name, avatar_url, rating)')
      .order('created_at', { ascending: false })

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }
    set({ requests: (data as HelpRequest[]) ?? [], isLoading: false })
  },

  createRequest: async (payload) => {
    const { data, error } = await supabase
      .from('help_requests')
      .insert({ ...payload, status: 'open' })
      .select('*, profiles(id, first_name, last_name, avatar_url, rating)')
      .single()

    if (error) throw new Error(error.message)
    const req = data as HelpRequest
    set((s) => ({ requests: [req, ...s.requests] }))
    return req
  },

  updateStatus: async (id, status) => {
    const { error } = await supabase
      .from('help_requests')
      .update({ status })
      .eq('id', id)

    if (error) throw new Error(error.message)
    set((s) => ({
      requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)),
    }))
  },

  getFiltered: () => {
    const { requests, filters } = get()
    let list = [...requests]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      )
    }
    if (filters.category !== 'all') list = list.filter((r) => r.category === filters.category)
    if (filters.urgency !== 'all') list = list.filter((r) => r.urgency === filters.urgency)
    if (filters.format !== 'all') {
      const isOnline = filters.format === 'online'
      list = list.filter((r) => r.is_online === isOnline)
    }

    if (filters.sortBy === 'urgent') {
      const order: Record<HelpRequestUrgency, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
      list.sort((a, b) => order[a.urgency] - order[b.urgency])
    }
    // 'newest' is already the default from the DB query

    return list
  },
}))

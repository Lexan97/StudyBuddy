import { create } from 'zustand'
import type { Notification } from '@/types'
import { mockNotifications } from '@/data/mock'

interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info'
}

type Theme = 'light' | 'dark'

interface UIState {
  sidebarOpen: boolean
  notifications: Notification[]
  toasts: Toast[]
  theme: Theme
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  markNotificationRead: (id: string) => void
  unreadNotificationCount: () => number
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('studybuddy-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') return stored
  }
  return 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  localStorage.setItem('studybuddy-theme', theme)
}

// Apply on load
const initialTheme = getInitialTheme()
applyTheme(initialTheme)

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  notifications: mockNotifications,
  toasts: [],
  theme: initialTheme,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  addToast: (toast) => {
    const id = `toast-${Date.now()}`
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => get().removeToast(id), 4000)
  },

  removeToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },

  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
  },

  unreadNotificationCount: () => get().notifications.filter((n) => !n.read).length,

  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    set({ theme: next })
  },
}))

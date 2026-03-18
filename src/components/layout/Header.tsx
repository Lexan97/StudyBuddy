import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Menu, X, Sun, Moon } from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { getInitials } from '@/lib/utils'

export function Header() {
  const user = useAuthStore((s) => s.user)
  const { notifications, toggleSidebar, sidebarOpen, markNotificationRead, theme, toggleTheme } = useUIStore()
  const unreadCount = notifications.filter((n) => !n.read).length
  const [showNotifs, setShowNotifs] = useState(false)

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8">
      {/* Left: mobile menu */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="hidden lg:block" />

      {/* Right: theme toggle + notifications + avatar */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-card-foreground">Уведомления</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Нет уведомлений
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id)
                          }}
                          className={cn(
                            'w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0',
                            !notif.read && 'bg-emerald-500/5'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {!notif.read && (
                              <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            )}
                            <div className={cn(!notif.read ? '' : 'ml-5')}>
                              <p className="text-sm font-medium text-card-foreground">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{notif.text}</p>
                              <p className="text-xs text-muted-foreground/70 mt-1">{timeAgo(notif.createdAt)}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors"
          >
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-muted" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
                {getInitials(user.name)}
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium">{user.name.split(' ')[0]}</span>
          </Link>
        )}
      </div>
    </header>
  )
}

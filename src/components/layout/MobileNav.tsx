import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  PlusCircle,
  MessageCircle,
  User,
  ClipboardList,
  Send,
  Award,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { LogoFull } from '@/components/shared/Logo'
const navItems = [
  { to: '/feed', icon: LayoutDashboard, label: 'Лента задач' },
  { to: '/create-task', icon: PlusCircle, label: 'Создать задачу' },
  { to: '/chats', icon: MessageCircle, label: 'Чаты' },
  { to: '/my-tasks', icon: ClipboardList, label: 'Мои задачи' },
  { to: '/my-responses', icon: Send, label: 'Мои отклики' },
  { to: '/profile', icon: User, label: 'Профиль' },
  { to: '/reputation', icon: Award, label: 'Репутация' },
]

export function MobileNav() {
  const location = useLocation()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const totalUnread = 0 // unread count managed per-chat session

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-background border-r border-border lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-border">
              <LogoFull iconSize={30} />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                    {item.to === '/chats' && totalUnread > 0 && (
                      <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                        {totalUnread}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

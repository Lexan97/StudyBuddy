import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  PlusCircle,
  MessageCircle,
  User,
  ClipboardList,
  Send,
  Award,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
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

export function Sidebar() {
  const location = useLocation()
  const logout = useAuthStore((s) => s.logout)
  const totalUnread = 0 // unread count managed per-chat session

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-background/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-border">
        <LogoFull iconSize={30} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative block"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-muted"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'text-foreground'
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
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  )
}

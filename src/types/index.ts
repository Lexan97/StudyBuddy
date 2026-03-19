// ── Supabase DB row types ────────────────────────────────────────────────────

export interface Profile {
  id: string
  first_name: string
  last_name: string
  email: string
  avatar_url: string | null
  rating: number
}

export type HelpRequestStatus = 'open' | 'in_progress' | 'closed'
export type HelpRequestUrgency = 'low' | 'medium' | 'high' | 'urgent'
export type HelpRequestCategory =
  | 'math'
  | 'programming'
  | 'physics'
  | 'chemistry'
  | 'languages'
  | 'humanities'
  | 'economics'
  | 'design'
  | 'other'

export interface HelpRequest {
  id: string
  creator_id: string
  title: string
  description: string
  deadline: string
  urgency: HelpRequestUrgency
  category: HelpRequestCategory
  is_online: boolean
  location: string | null
  status: HelpRequestStatus
  created_at: string
  // joined
  profiles?: Profile
}

export interface Message {
  id: string
  request_id: string
  sender_id: string
  text: string
  created_at: string
  // joined
  profiles?: Profile
}

// ── Legacy UI types (kept for non-refactored pages) ──────────────────────────

export type TaskStatus = HelpRequestStatus
export type TaskUrgency = HelpRequestUrgency
export type TaskFormat = 'online' | 'offline'
export type TaskCategory = HelpRequestCategory

export type ResponseStatus = 'pending' | 'accepted' | 'rejected'

export type BadgeType =
  | 'reliable'
  | 'fast_responder'
  | 'helpful'
  | 'academic'
  | 'mentor'
  | 'newcomer'
  | 'exchange_master'

export type ReputationLevel = 'newcomer' | 'helper' | 'expert' | 'star'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  university: string
  faculty: string
  bio: string
  badges: BadgeType[]
  reputation: number
  reputationLevel: ReputationLevel
  completedTasks: number
  responseTime: string
  joinedAt: string
  isOnline: boolean
  lastSeen: string
}

export interface Task {
  id: string
  title: string
  description: string
  category: TaskCategory
  urgency: TaskUrgency
  status: TaskStatus
  format: TaskFormat
  location?: string
  deadline: string
  authorId: string
  maxExecutors: number
  acceptedExecutors: string[]
  responses: TaskResponse[]
  allowExchange: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskResponse {
  id: string
  taskId: string
  userId: string
  message: string
  status: ResponseStatus
  isExchangeOffer: boolean
  exchangeTaskId?: string
  createdAt: string
}

export interface ChatConversation {
  id: string
  participants: string[]
  lastMessage: ChatMessage | null
  unreadCount: number
  updatedAt: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  text: string
  createdAt: string
  read: boolean
}

export interface Review {
  id: string
  fromUserId: string
  toUserId: string
  taskId: string
  rating: number
  text: string
  tags: string[]
  createdAt: string
}

export interface Notification {
  id: string
  type: 'response' | 'accepted' | 'message' | 'review' | 'badge'
  title: string
  text: string
  read: boolean
  createdAt: string
}

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  math: 'Математика',
  programming: 'Программирование',
  physics: 'Физика',
  chemistry: 'Химия',
  languages: 'Языки',
  humanities: 'Гуманитарные',
  economics: 'Экономика',
  design: 'Дизайн',
  other: 'Другое',
}

export const URGENCY_LABELS: Record<TaskUrgency, string> = {
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
  urgent: 'Срочно',
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  open: 'Открыта',
  in_progress: 'В работе',
  closed: 'Закрыта',
}

export const BADGE_INFO: Record<BadgeType, { label: string; description: string; icon: string }> = {
  reliable: { label: 'Надёжный помощник', description: 'Всегда доводит дело до конца', icon: 'shield-check' },
  fast_responder: { label: 'Быстро откликается', description: 'Среднее время отклика менее 30 минут', icon: 'zap' },
  helpful: { label: 'Часто выручает', description: 'Помог более чем 10 студентам', icon: 'heart-handshake' },
  academic: { label: 'Сильный в учёбе', description: 'Отлично разбирается в предмете', icon: 'graduation-cap' },
  mentor: { label: 'Наставник', description: 'Помогает разобраться, а не просто даёт ответы', icon: 'sparkles' },
  newcomer: { label: 'Новичок', description: 'Недавно присоединился к платформе', icon: 'rocket' },
  exchange_master: { label: 'Мастер обмена', description: 'Успешно обменялся задачами более 5 раз', icon: 'repeat' },
}

export const REPUTATION_LEVELS: Record<ReputationLevel, { label: string; minPoints: number; color: string }> = {
  newcomer: { label: 'Новичок', minPoints: 0, color: '#94a3b8' },
  helper: { label: 'Помощник', minPoints: 50, color: '#2dd4bf' },
  expert: { label: 'Эксперт', minPoints: 150, color: '#34d399' },
  star: { label: 'Звезда', minPoints: 300, color: '#059669' },
}

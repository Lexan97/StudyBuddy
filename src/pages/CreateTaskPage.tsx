import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Settings,
  Eye,
  Globe,
  MapPin,
  Calendar,
  AlertCircle,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { CATEGORY_LABELS, URGENCY_LABELS } from '@/types'
import type { HelpRequestCategory, HelpRequestUrgency } from '@/types'

const steps = [
  { id: 1, label: 'Основное', icon: FileText },
  { id: 2, label: 'Детали', icon: Settings },
  { id: 3, label: 'Предпросмотр', icon: Eye },
]

export default function CreateTaskPage() {
  const navigate = useNavigate()
  const { createRequest } = useTaskStore()
  const user = useAuthStore((s) => s.user)
  const addToast = useUIStore((s) => s.addToast)

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<HelpRequestCategory>('programming')
  const [urgency, setUrgency] = useState<HelpRequestUrgency>('medium')
  const [isOnline, setIsOnline] = useState(true)
  const [location, setLocation] = useState('')
  const [deadline, setDeadline] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Укажите заголовок'
    if (!description.trim()) e.description = 'Укажите описание'
    setErrors(e)
    return !Object.keys(e).length
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (!deadline) e.deadline = 'Укажите дедлайн'
    if (!isOnline && !location.trim()) e.location = 'Укажите место встречи'
    setErrors(e)
    return !Object.keys(e).length
  }

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep((s) => Math.min(s + 1, 3))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handlePublish = async () => {
    if (!user) return
    setIsSubmitting(true)
    try {
      await createRequest({
        title,
        description,
        deadline,
        urgency,
        category,
        is_online: isOnline,
        location: isOnline ? null : location,
        creator_id: user.id,
      })
      addToast({ title: 'Запрос опубликован!', description: 'Ваш запрос появился в ленте', type: 'success' })
      navigate('/feed')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка публикации'
      addToast({ title: 'Ошибка', description: msg, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Создать запрос</h1>
        <p className="text-sm text-muted-foreground">Опишите, с чем вам нужна помощь</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => { if (s.id < step) setStep(s.id) }}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1',
                step === s.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : step > s.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-muted text-muted-foreground border border-border'
              )}
            >
              {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={cn('w-8 h-px', step > s.id ? 'bg-emerald-500/30' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Заголовок</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setErrors((er) => ({ ...er, title: '' })) }}
                  placeholder="Например: Помощь с линейной алгеброй"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all',
                    errors.title ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:border-emerald-500 focus:ring-emerald-500/30'
                  )}
                />
                {errors.title && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setErrors((er) => ({ ...er, description: '' })) }}
                  placeholder="Подробно опишите, что именно нужно сделать..."
                  rows={5}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all resize-none',
                    errors.description ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:border-emerald-500 focus:ring-emerald-500/30'
                  )}
                />
                {errors.description && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Категория</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(CATEGORY_LABELS) as [HelpRequestCategory, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        category === key
                          ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar className="inline w-4 h-4 mr-1.5" />Дедлайн
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => { setDeadline(e.target.value); setErrors((er) => ({ ...er, deadline: '' })) }}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl bg-muted border text-sm text-foreground focus:outline-none focus:ring-1 transition-all',
                    errors.deadline ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:border-emerald-500 focus:ring-emerald-500/30'
                  )}
                />
                {errors.deadline && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.deadline}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Срочность</label>
                <div className="flex gap-2">
                  {(Object.entries(URGENCY_LABELS) as [HelpRequestUrgency, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setUrgency(key)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex-1',
                        urgency === key
                          ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Формат</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOnline(true)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all flex-1',
                      isOnline ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Globe className="w-4 h-4" /> Онлайн
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOnline(false)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all flex-1',
                      !isOnline ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <MapPin className="w-4 h-4" /> Оффлайн
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {!isOnline && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-1.5" />Место встречи
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => { setLocation(e.target.value); setErrors((er) => ({ ...er, location: '' })) }}
                      placeholder="Адрес или место встречи"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all',
                        errors.location ? 'border-red-500/50 focus:ring-red-500/20' : 'border-border focus:border-emerald-500 focus:ring-emerald-500/30'
                      )}
                    />
                    {errors.location && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.location}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold">Предпросмотр</h2>
              <div className="space-y-3">
                <PreviewRow label="Заголовок" value={title} />
                <PreviewRow label="Описание" value={description} />
                <div className="grid grid-cols-2 gap-4">
                  <PreviewRow label="Категория" value={CATEGORY_LABELS[category]} />
                  <PreviewRow label="Срочность" value={URGENCY_LABELS[urgency]} />
                  <PreviewRow label="Формат" value={isOnline ? 'Онлайн' : 'Оффлайн'} />
                  <PreviewRow label="Дедлайн" value={deadline || '—'} />
                  {!isOnline && <PreviewRow label="Место" value={location || '—'} />}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <div>
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-accent transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
          )}
        </div>
        <div>
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              Далее <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Опубликовать
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm mt-1">{value || '—'}</p>
    </div>
  )
}

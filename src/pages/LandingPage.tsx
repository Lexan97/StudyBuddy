import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogoFull } from '@/components/shared/Logo'
import {
  Users,
  MessageCircle,
  ArrowRightLeft,
  Shield,
  Zap,
  Star,
  ChevronRight,
  GraduationCap,
  Heart,
} from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const features = [
  {
    icon: Zap,
    title: 'Лента задач',
    description:
      'Публикуй свою задачу и она мгновенно появится в ленте. Тысячи студентов увидят её и смогут помочь.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Heart,
    title: 'Откликайся',
    description:
      'Видишь задачу, в которой разбираешься? Откликнись в один клик и помоги однокурснику.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: MessageCircle,
    title: 'Чат в реальном времени',
    description:
      'Встроенный чат с поддержкой кода, формул и файлов. Общайся и решай задачи вместе.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: ArrowRightLeft,
    title: 'Обмен задачами',
    description:
      'Помоги другому — получи помощь взамен. Справедливая система взаимопомощи без денег.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Мягкий рейтинг',
    description:
      'Рейтинг основан на благодарностях, а не наказаниях. Чем больше помогаешь — тем выше статус.',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: Users,
    title: 'Сообщество',
    description:
      'Присоединяйся к сообществу студентов, которые верят в силу взаимопомощи и коллаборации.',
    gradient: 'from-emerald-500 to-teal-500',
  },
]

const steps = [
  {
    number: '1',
    title: 'Публикуй задачу',
    description:
      'Опиши свою задачу, выбери предмет и сложность. Это займёт меньше минуты.',
  },
  {
    number: '2',
    title: 'Получай отклики',
    description:
      'Студенты, которые разбираются в теме, откликнутся и предложат помощь.',
  },
  {
    number: '3',
    title: 'Решай вместе',
    description:
      'Общайтесь в чате, делитесь решениями и учитесь друг у друга.',
  },
]

const stats = [
  { value: '5 000+', label: 'студентов' },
  { value: '12 000+', label: 'задач' },
  { value: '98%', label: 'довольных' },
  { value: '50+', label: 'вузов' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="group">
            <LogoFull iconSize={28} />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Войти
            </Link>
            <Link
              to="/auth"
              className="px-5 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 text-white"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-600/10 to-green-600/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(128,128,128,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Radial gradient vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background)/0.8)_70%)]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-muted text-sm text-muted-foreground"
            >
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span>Платформа взаимопомощи студентов</span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8"
            >
              Помогай и{' '}
              <span className="gradient-text">получай помощь</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-12"
            >
              StudyBuddy — платформа, где студенты помогают друг другу с учёбой.
              Публикуй задачи, откликайся на чужие и решай вместе. Бесплатно и без
              барьеров.
            </motion.p>

            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                to="/auth"
                className="group relative inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 text-white"
              >
                Начать помогать
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-full border border-border hover:bg-muted transition-all text-foreground/80 hover:text-foreground"
              >
                Узнать больше
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section id="features" className="relative py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-4"
            >
              Возможности
            </motion.p>
            <motion.h2
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Всё для совместной учёбы
            </motion.h2>
            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg text-muted-foreground"
            >
              Инструменты, которые делают взаимопомощь простой, быстрой и
              приятной.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="glass-card group relative rounded-2xl border border-border bg-card p-8 hover:bg-surface-hover hover:border-primary/30 transition-all duration-500"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-4"
            >
              Как это работает
            </motion.p>
            <motion.h2
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              Три простых шага
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-emerald-500/40 via-teal-500/40 to-emerald-500/40" />

            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="relative text-center flex flex-col items-center"
              >
                <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-2xl font-bold mb-6 shadow-xl shadow-emerald-500/20 text-white">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="relative overflow-hidden rounded-3xl border border-border p-12 md:p-20 text-center"
          >
            {/* CTA background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-green-600/20" />
            <div className="absolute inset-0 bg-background/50" />

            {/* Decorative orbs */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-600/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.div
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 mb-8 shadow-xl shadow-emerald-500/30"
              >
                <GraduationCap className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h2
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
              >
                Готов начать учиться вместе?
              </motion.h2>
              <motion.p
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-xl mx-auto text-lg text-muted-foreground mb-10"
              >
                Присоединяйся к тысячам студентов, которые уже помогают друг другу
                каждый день.
              </motion.p>
              <motion.div
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link
                  to="/auth"
                  className="group inline-flex items-center gap-2 px-10 py-4 text-base font-semibold rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 text-white"
                >
                  Создать аккаунт бесплатно
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <LogoFull iconSize={24} />
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground/80 transition-colors">
              Возможности
            </a>
            <Link to="/auth" className="hover:text-foreground/80 transition-colors">
              Войти
            </Link>
            <Link to="/auth" className="hover:text-foreground/80 transition-colors">
              Регистрация
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StudyBuddy. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  )
}
